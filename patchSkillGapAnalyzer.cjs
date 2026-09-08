const fs = require('fs');
let content = fs.readFileSync('src/components/SkillGapAnalyzer.jsx', 'utf8');

// 1. Add LearnerProgressContext import
content = content.replace(
  "import { AlertTriangle, CheckCircle2, TrendingUp, ArrowRight, ShieldAlert, Target, Award, Sparkles, Lightbulb } from 'lucide-react';",
  "import { AlertTriangle, CheckCircle2, TrendingUp, ArrowRight, ShieldAlert, Target, Award, Sparkles, Lightbulb } from 'lucide-react';\nimport { useLearnerProgress } from '../context/LearnerProgressContext';"
);

// 2. Extract accuracy from context
content = content.replace(
  "const [filterSeverity, setFilterSeverity] = useState('ALL');",
  "const [filterSeverity, setFilterSeverity] = useState('ALL');\n  const { getAccuracy } = useLearnerProgress();"
);

// 3. Add dynamic domain accuracy average to domainSummaries
content = content.replace(
  "const gapScore = Math.max(0, Math.round(((avgTarget - avgCurrent) / 5) * 100));",
  "const gapScore = Math.max(0, Math.round(((avgTarget - avgCurrent) / 5) * 100));\n    const avgAccuracy = dSkills.reduce((acc, s) => acc + getAccuracy(s.id), 0) / (dSkills.length || 1);"
);

content = content.replace(
  "avgTarget: avgTarget.toFixed(1),",
  "avgTarget: avgTarget.toFixed(1),\n      avgAccuracy,"
);

// 4. Update the Math.random() with actual accuracy
content = content.replace(
  "Math.floor(Math.random() * 20 + 10)",
  "Math.round(d.avgAccuracy)"
);

fs.writeFileSync('src/components/SkillGapAnalyzer.jsx', content);
console.log("Patched successfully");
