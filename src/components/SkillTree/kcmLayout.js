/**
 * kcmLayout.js
 * Dagre-based hierarchical layout engine for the KCM competency graph.
 *
 * v12 NOTE: Node dimensions live in node.measured.width / node.measured.height
 * We use fallback defaults for initial layout before React Flow measures nodes.
 */
import dagre from 'dagre';

const DEFAULT_NODE_WIDTH  = 210;
const DEFAULT_NODE_HEIGHT = 100;
const RANK_SEPARATION     = 140;  // vertical distance between levels
const NODE_SEPARATION     = 30;   // horizontal distance between siblings

/**
 * Builds dagre layout for a set of React Flow nodes + edges.
 * Mutates copies of nodes to assign x/y positions.
 *
 * @param {Node[]} nodes  — React Flow node objects
 * @param {Edge[]} edges  — React Flow edge objects
 * @param {'TB'|'LR'} direction — layout direction (top-bottom or left-right)
 * @returns {{ nodes: Node[], edges: Edge[] }}
 */
export function applyDagreLayout(nodes, edges, direction = 'TB') {
  const g = new dagre.graphlib.Graph({ compound: true });

  g.setGraph({
    rankdir: direction,
    ranksep: RANK_SEPARATION,
    nodesep: NODE_SEPARATION,
    marginx: 40,
    marginy: 40,
    align: 'DL',
  });

  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((node) => {
    const w = node.measured?.width  ?? node.width  ?? DEFAULT_NODE_WIDTH;
    const h = node.measured?.height ?? node.height ?? DEFAULT_NODE_HEIGHT;
    g.setNode(node.id, { width: w, height: h });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  const laidOutNodes = nodes.map((node) => {
    const dagreNode = g.node(node.id);
    const w = node.measured?.width  ?? DEFAULT_NODE_WIDTH;
    const h = node.measured?.height ?? DEFAULT_NODE_HEIGHT;
    return {
      ...node,
      position: {
        x: dagreNode.x - w / 2,
        y: dagreNode.y - h / 2,
      },
      // Preserve measurement
      measured: node.measured,
    };
  });

  return { nodes: laidOutNodes, edges };
}

/**
 * Converts KCM competency data into React Flow nodes & edges.
 *
 * @param {object[]} competencies   — from kcmFracData.KCM_COMPETENCIES
 * @param {object}   userScores     — { [competencyId]: currentLevel (1-5) }
 * @param {object}   targetProfile  — { [competencyId]: requiredLevel (1-5) }
 * @param {string[]} criticalPath   — IDs on the promotion critical path
 */
export function buildGraphElements(competencies, userScores, targetProfile, criticalPath = []) {
  const nodes = competencies.map((comp) => {
    const current  = userScores[comp.id]     ?? 0;
    const required = targetProfile[comp.id]  ?? 0;

    // Determine lock state: prerequisites must all be >= 3
    const prereqsMet = comp.prerequisites.every(
      (pid) => (userScores[pid] ?? 0) >= 3
    );

    let status;
    if (!prereqsMet && required > 0) {
      status = 'LOCKED';
    } else if (required === 0) {
      status = 'LOCKED'; // Not required for this role
    } else if (current >= required) {
      status = 'PROFICIENT';
    } else if (criticalPath.includes(comp.id)) {
      status = 'CRITICAL_PATH';
    } else {
      status = 'GAP';
    }

    return {
      id: comp.id,
      type: 'competencyNode',
      data: {
        comp,
        current,
        required,
        status,
        prereqsMet,
      },
      // Dagre will compute actual position
      position: { x: 0, y: 0 },
      // Give React Flow a hint before measurement
      width:  DEFAULT_NODE_WIDTH,
      height: DEFAULT_NODE_HEIGHT,
    };
  });

  const edges = [];
  competencies.forEach((comp) => {
    comp.prerequisites.forEach((pid) => {
      edges.push({
        id: `e-${pid}-${comp.id}`,
        source: pid,
        target: comp.id,
        type: 'smoothstep',
        animated: criticalPath.includes(comp.id) && criticalPath.includes(pid),
        style: {
          stroke: criticalPath.includes(comp.id) ? '#EF4444' : 'rgba(100,116,139,0.5)',
          strokeWidth: criticalPath.includes(comp.id) ? 2.5 : 1.5,
          strokeDasharray: criticalPath.includes(comp.id) ? '6 3' : undefined,
        },
        markerEnd: {
          type: 'arrowclosed',
          color: criticalPath.includes(comp.id) ? '#EF4444' : '#94a3b8',
          width: 16,
          height: 16,
        },
      });
    });
  });

  return { nodes, edges };
}

/**
 * Computes the shortest critical path (BFS) from the user's current state
 * to meeting all requirements of the target role.
 * Returns an ordered array of competency IDs that are both in-gap AND
 * have their prerequisites satisfied soonest.
 */
export function computeCriticalPath(competencies, userScores, targetProfile) {
  // Find all gap nodes
  const gapIds = new Set(
    competencies
      .filter((c) => {
        const cur = userScores[c.id] ?? 0;
        const req = targetProfile[c.id] ?? 0;
        return req > 0 && cur < req;
      })
      .map((c) => c.id)
  );

  if (gapIds.size === 0) return [];

  // BFS from gap nodes upward through their prerequisites
  const path = new Set();
  const queue = [...gapIds];

  while (queue.length) {
    const id = queue.shift();
    if (path.has(id)) continue;
    path.add(id);
    const comp = competencies.find((c) => c.id === id);
    if (!comp) continue;
    comp.prerequisites.forEach((pid) => {
      if (!path.has(pid)) queue.push(pid);
    });
  }

  // Return only those that are actual gaps (filter out already proficient prereqs)
  return [...path].filter((id) => gapIds.has(id));
}
