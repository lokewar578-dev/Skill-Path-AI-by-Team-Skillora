/**
 * LearnerProgressContext.jsx
 * Global context for tracking per-competency quiz attempt history,
 * computing rolling accuracy, and dynamically classifying the learner tier.
 *
 * State shape:
 *   attemptHistory: {
 *     [competencyId]: {
 *       attempts: [{ correct: bool, timeMs: number, timestamp: string }],
 *       rollingAccuracy: number,   // 0–100 based on last 10 attempts
 *       tier: 'T12' | 'T3' | 'T45'
 *     }
 *   }
 *   overallStats: { totalAttempts, totalCorrect, overallAccuracy, overallTier }
 */
import React, { createContext, useContext, useCallback, useMemo, useReducer } from 'react';

// ── Tier classification thresholds ─────────────────────────────────────────
const TIER_THRESHOLDS = {
  T12: { max: 60 },   // accuracy < 60% → Novice / Developing
  T3:  { min: 60, max: 80 }, // 60–80% → Intermediate
  T45: { min: 80 },   // > 80% → Advanced / Expert
};

const ROLLING_WINDOW = 10; // how many recent attempts to weight

function classifyTier(accuracy) {
  if (accuracy >= 80) return 'T45';
  if (accuracy >= 60) return 'T3';
  return 'T12';
}

function computeRollingAccuracy(attempts) {
  if (!attempts || attempts.length === 0) return 0;
  const window = attempts.slice(-ROLLING_WINDOW);
  const correct = window.filter((a) => a.correct).length;
  return Math.round((correct / window.length) * 100);
}

// ── Reducer ────────────────────────────────────────────────────────────────
const initialState = {
  attemptHistory: {},
  // Pre-seed some history for the demo persona so the tier engine fires immediately
  // Real app would load this from a backend/localStorage
};

function reducer(state, action) {
  switch (action.type) {
    case 'RECORD_ATTEMPT': {
      const { competencyId, correct, timeMs } = action.payload;
      const existing = state.attemptHistory[competencyId] ?? { attempts: [] };
      const newAttempts = [
        ...existing.attempts,
        { correct, timeMs, timestamp: new Date().toISOString() },
      ];
      const rollingAccuracy = computeRollingAccuracy(newAttempts);
      const tier = classifyTier(rollingAccuracy);
      return {
        ...state,
        attemptHistory: {
          ...state.attemptHistory,
          [competencyId]: { attempts: newAttempts, rollingAccuracy, tier },
        },
      };
    }

    case 'RECORD_QUIZ_RESULT': {
      // Record multiple competency scores from a single quiz session
      const { results } = action.payload; // [{ competencyId, correct, timeMs }]
      let next = { ...state.attemptHistory };
      results.forEach(({ competencyId, correct, timeMs }) => {
        const existing = next[competencyId] ?? { attempts: [] };
        const newAttempts = [
          ...existing.attempts,
          { correct, timeMs, timestamp: new Date().toISOString() },
        ];
        const rollingAccuracy = computeRollingAccuracy(newAttempts);
        const tier = classifyTier(rollingAccuracy);
        next[competencyId] = { attempts: newAttempts, rollingAccuracy, tier };
      });
      return { ...state, attemptHistory: next };
    }

    case 'SEED_DEMO_DATA': {
      // Seed demo history based on activePersona's competency profile
      const { competencyScores } = action.payload;
      const seeded = {};
      Object.entries(competencyScores).forEach(([compId, level]) => {
        // Level 1–2 → ~40% accuracy seed; 3 → ~70%; 4–5 → ~88%
        const baseAccuracy = level <= 2 ? 40 : level === 3 ? 70 : 88;
        const attempts = Array.from({ length: 6 }, (_, i) => ({
          correct: Math.random() * 100 < baseAccuracy,
          timeMs: Math.round(30000 + Math.random() * 60000),
          timestamp: new Date(Date.now() - (6 - i) * 86400000).toISOString(),
        }));
        const rollingAccuracy = computeRollingAccuracy(attempts);
        seeded[compId] = { attempts, rollingAccuracy, tier: classifyTier(rollingAccuracy) };
      });
      return { ...state, attemptHistory: seeded };
    }

    case 'RESET_COMPETENCY': {
      const next = { ...state.attemptHistory };
      delete next[action.payload.competencyId];
      return { ...state, attemptHistory: next };
    }

    default:
      return state;
  }
}

// ── Context ────────────────────────────────────────────────────────────────
const LearnerProgressContext = createContext(null);

export function LearnerProgressProvider({ children, activePersona }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Seed demo data once persona loads (real app: fetch from API)
  const hasSeeded = React.useRef(false);
  React.useEffect(() => {
    if (activePersona?.currentCompetencies && !hasSeeded.current) {
      hasSeeded.current = true;
      dispatch({ type: 'SEED_DEMO_DATA', payload: { competencyScores: activePersona.currentCompetencies } });
    }
  }, [activePersona]);

  // ── Actions ──────────────────────────────────────────────────────────────
  const recordAttempt = useCallback((competencyId, correct, timeMs = 0) => {
    dispatch({ type: 'RECORD_ATTEMPT', payload: { competencyId, correct, timeMs } });
  }, []);

  const recordQuizResult = useCallback((results) => {
    dispatch({ type: 'RECORD_QUIZ_RESULT', payload: { results } });
  }, []);

  // ── Queries ──────────────────────────────────────────────────────────────
  const getTier = useCallback(
    (competencyId) => {
      return state.attemptHistory[competencyId]?.tier ?? 'T12';
    },
    [state.attemptHistory]
  );

  const getAccuracy = useCallback(
    (competencyId) => {
      return state.attemptHistory[competencyId]?.rollingAccuracy ?? 0;
    },
    [state.attemptHistory]
  );

  const getAttemptCount = useCallback(
    (competencyId) => {
      return state.attemptHistory[competencyId]?.attempts?.length ?? 0;
    },
    [state.attemptHistory]
  );

  // Overall tier — weighted average across all tracked competencies
  const overallStats = useMemo(() => {
    const entries = Object.values(state.attemptHistory);
    if (entries.length === 0) return { totalAttempts: 0, totalCorrect: 0, overallAccuracy: 0, overallTier: 'T12' };

    let totalAttempts = 0;
    let totalCorrect = 0;

    entries.forEach(({ attempts }) => {
      const window = attempts.slice(-ROLLING_WINDOW);
      totalAttempts += window.length;
      totalCorrect  += window.filter((a) => a.correct).length;
    });

    const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
    return {
      totalAttempts,
      totalCorrect,
      overallAccuracy,
      overallTier: classifyTier(overallAccuracy),
    };
  }, [state.attemptHistory]);

  const value = {
    attemptHistory: state.attemptHistory,
    overallStats,
    // Actions
    recordAttempt,
    recordQuizResult,
    // Queries
    getTier,
    getAccuracy,
    getAttemptCount,
    // Tier metadata (pass-through from adaptiveQuizData)
    TIER_THRESHOLDS,
    classifyTier,
  };

  return (
    <LearnerProgressContext.Provider value={value}>
      {children}
    </LearnerProgressContext.Provider>
  );
}

export function useLearnerProgress() {
  const ctx = useContext(LearnerProgressContext);
  if (!ctx) throw new Error('useLearnerProgress must be used within LearnerProgressProvider');
  return ctx;
}
