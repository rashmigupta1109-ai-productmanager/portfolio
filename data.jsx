// ─── Categories ───────────────────────────────────
const CATEGORIES = {
  rpa: {
    key: 'rpa',
    name: 'RPA',
    full: 'Robotic Process Automation',
    color: 'var(--rpa)',
    ink: 'var(--rpa-ink)',
    fill: 'var(--rpa-fill)',
    fillStrong: 'var(--rpa-fill-strong)',
    tagline: 'Repeatable, rule-based',
    bullets: [
      'UI automation',
      'Legacy systems',
      'Repetitive tasks',
      'Rule-based flows',
      'No API available',
    ],
    when: 'When tasks are repetitive and systems are UI-driven, with no programmatic access.',
    speed: 'Days to weeks',
    cost: 'Low–Medium',
    risk: 'Brittle to UI change',
  },
  ai: {
    key: 'ai',
    name: 'AI',
    full: 'Artificial Intelligence',
    color: 'var(--ai)',
    ink: 'var(--ai-ink)',
    fill: 'var(--ai-fill)',
    fillStrong: 'var(--ai-fill-strong)',
    tagline: 'Judgment & unstructured',
    bullets: [
      'Unstructured data',
      'Judgment / reasoning',
      'Prediction',
      'Conversation',
      'Content extraction',
    ],
    when: 'When work requires interpretation, reasoning, or unstructured inputs.',
    speed: 'Weeks',
    cost: 'Medium–High',
    risk: 'Probabilistic outputs',
  },
  api: {
    key: 'api',
    name: 'API',
    full: 'Application Programming Interface',
    color: 'var(--api)',
    ink: 'var(--api-ink)',
    fill: 'var(--api-fill)',
    fillStrong: 'var(--api-fill-strong)',
    tagline: 'Direct system-to-system',
    bullets: [
      'Structured systems',
      'Fast & reliable',
      'Direct integration',
      'Scalable',
      'System-to-system',
    ],
    when: 'When systems are structured and accessible via clean interfaces.',
    speed: 'Days',
    cost: 'Low',
    risk: 'Requires API access',
  },
};

// ─── Overlap regions ──────────────────────────────
const OVERLAPS = {
  'ai-rpa': {
    label: 'AI + RPA',
    title: 'Cognitive task automation',
    body: 'When repetitive UI work also needs judgment — reading invoices, classifying tickets, summarizing screens.',
  },
  'ai-api': {
    label: 'AI + API',
    title: 'Intelligent workflows',
    body: 'When structured systems benefit from reasoning — copilot features, smart routing, agentic actions over APIs.',
  },
  'rpa-api': {
    label: 'RPA + API',
    title: 'Bridge legacy + modern',
    body: 'When some systems have APIs and others don\u2019t — orchestrate across both with deterministic rules.',
  },
  'all': {
    label: 'All three',
    title: 'Best-fit automation strategy',
    body: 'Real-world automation usually combines all three. Pick the right tool per step in the workflow.',
  },
};

// ─── Sliders / dimensions ────────────────────────
// Each slider has 3 stops: left → API, middle → RPA, right → AI
// scoreContribution returns { rpa, ai, api } weights based on slider value (0..1)
const DIMENSIONS = [
  {
    key: 'data_type',
    name: 'Data type',
    desc: 'How structured is the input?',
    leftLabel: 'Structured',
    rightLabel: 'Unstructured',
    score: (v) => ({ api: 1 - v, rpa: 1 - Math.abs(v - 0.45) * 1.3, ai: v }),
  },
  {
    key: 'decision',
    name: 'Decision complexity',
    desc: 'Is logic deterministic or judgment-based?',
    leftLabel: 'Deterministic',
    rightLabel: 'Judgment-based',
    score: (v) => ({ api: 1 - v, rpa: 1 - Math.abs(v - 0.45) * 1.3, ai: v }),
  },
  {
    key: 'access',
    name: 'System access',
    desc: 'How is the system reachable?',
    leftLabel: 'APIs available',
    rightLabel: 'UI only',
    score: (v) => ({ api: 1 - v, rpa: v, ai: 0.4 + v * 0.2 }),
  },
  {
    key: 'change',
    name: 'Change frequency',
    desc: 'How stable is the process?',
    leftLabel: 'Stable',
    rightLabel: 'Frequently changing',
    // Stable favors RPA/API; volatile favors AI
    score: (v) => ({ api: 1 - v * 0.7, rpa: 1 - v, ai: v }),
  },
  {
    key: 'scale',
    name: 'Scale & speed',
    desc: 'What throughput do you need?',
    leftLabel: 'Moderate',
    rightLabel: 'High-volume',
    // High volume favors API; moderate is fine for RPA/AI
    score: (v) => ({ api: 0.5 + v * 0.5, rpa: 1 - v * 0.6, ai: 0.7 - v * 0.2 }),
  },
];

// ─── Recommendation reasoning ────────────────────
function buildReason(scores, values) {
  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const winner = ranked[0][0];
  const second = ranked[1][0];
  const margin = ranked[0][1] - ranked[1][1];

  const cues = [];
  if (winner === 'ai') {
    if (values.data_type > 0.55) cues.push('unstructured inputs');
    if (values.decision > 0.55) cues.push('judgment-heavy decisions');
    if (values.change > 0.55) cues.push('a frequently changing process');
  }
  if (winner === 'rpa') {
    if (values.access > 0.5) cues.push('UI-only system access');
    if (values.decision < 0.45) cues.push('rule-based decisions');
    if (values.scale < 0.55) cues.push('moderate throughput');
  }
  if (winner === 'api') {
    if (values.data_type < 0.4) cues.push('structured data');
    if (values.access < 0.4) cues.push('available APIs');
    if (values.scale > 0.55) cues.push('high-volume needs');
  }

  let reason;
  if (cues.length === 0) {
    reason = `Scores are close, but ${CATEGORIES[winner].name} edges ahead. Consider combining with ${CATEGORIES[second].name} for hybrid steps.`;
  } else {
    const list = cues.length === 1
      ? cues[0]
      : cues.slice(0, -1).join(', ') + ' and ' + cues[cues.length - 1];
    reason = `${CATEGORIES[winner].name} fits because of ${list}.`;
    if (margin < 0.15) reason += ` Close call — combining with ${CATEGORIES[second].name} may help.`;
  }
  return { winner, reason, ranked };
}

window.CATEGORIES = CATEGORIES;
window.OVERLAPS = OVERLAPS;
window.DIMENSIONS = DIMENSIONS;
window.buildReason = buildReason;
