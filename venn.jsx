// Venn diagram with hover detection per region (single, pair, triple, none)
// Layout: 3 circles arranged in a triangle (RPA bottom-left, AI top, API bottom-right)

const VennDiagram = () => {
  const [hover, setHover] = React.useState(null); // 'rpa' | 'ai' | 'api' | 'ai-rpa' | 'ai-api' | 'rpa-api' | 'all' | null
  const [tooltip, setTooltip] = React.useState({ x: 0, y: 0, visible: false });
  const stageRef = React.useRef(null);

  // Circle geometry (SVG viewBox: 0 0 600 560)
  const W = 600, H = 560;
  const r = 165; // radius
  const C = {
    ai:  { cx: 300, cy: 200 },
    rpa: { cx: 195, cy: 360 },
    api: { cx: 405, cy: 360 },
  };

  // Distance check helper
  const inCircle = (px, py, c) => {
    const dx = px - c.cx, dy = py - c.cy;
    return dx * dx + dy * dy <= r * r;
  };

  const detectRegion = (px, py) => {
    const inAi = inCircle(px, py, C.ai);
    const inRpa = inCircle(px, py, C.rpa);
    const inApi = inCircle(px, py, C.api);
    const count = inAi + inRpa + inApi;
    if (count === 0) return null;
    if (count === 3) return 'all';
    if (count === 2) {
      if (inAi && inRpa) return 'ai-rpa';
      if (inAi && inApi) return 'ai-api';
      if (inRpa && inApi) return 'rpa-api';
    }
    if (inAi) return 'ai';
    if (inRpa) return 'rpa';
    if (inApi) return 'api';
    return null;
  };

  const handleMove = (e) => {
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const local = pt.matrixTransform(ctm.inverse());
    const region = detectRegion(local.x, local.y);
    setHover(region);

    // tooltip in stage coordinates (px from container)
    const stageRect = stageRef.current.getBoundingClientRect();
    setTooltip({
      x: e.clientX - stageRect.left,
      y: e.clientY - stageRect.top,
      visible: !!region,
    });
  };

  const handleLeave = () => {
    setHover(null);
    setTooltip(t => ({ ...t, visible: false }));
  };

  // Tooltip content
  const tooltipContent = React.useMemo(() => {
    if (!hover) return null;
    if (hover === 'rpa' || hover === 'ai' || hover === 'api') {
      const cat = CATEGORIES[hover];
      return {
        label: cat.full,
        title: cat.name,
        body: cat.tagline + ' — ' + cat.bullets.slice(0, 3).join(', ').toLowerCase() + '.',
      };
    }
    const o = OVERLAPS[hover];
    return { label: o.label, title: o.title, body: o.body };
  }, [hover]);

  const isActive = (key) => {
    if (!hover) return false;
    if (hover === key) return true;
    if (hover === 'all') return key === 'rpa' || key === 'ai' || key === 'api';
    if (hover === 'ai-rpa') return key === 'ai' || key === 'rpa';
    if (hover === 'ai-api') return key === 'ai' || key === 'api';
    if (hover === 'rpa-api') return key === 'rpa' || key === 'api';
    return false;
  };

  // Bullet positions (relative to each circle center)
  const renderBullets = (catKey, anchorX, anchorY, align) => {
    const cat = CATEGORIES[catKey];
    const lh = 16;
    return cat.bullets.map((b, i) => (
      <text
        key={b}
        x={anchorX}
        y={anchorY + i * lh}
        className="venn-label-bullet"
        textAnchor={align}
      >
        {'\u2022 ' + b}
      </text>
    ));
  };

  return (
    <div className="venn-panel">
      <div className="panel-eyebrow">
        <span className="num">01</span>
        <span>The Three Approaches</span>
        <span className="line"></span>
        <span style={{ color: 'var(--ink-3)' }}>Hover any region</span>
      </div>

      <div
        className={`venn-stage ${hover ? 'has-hover' : ''}`}
        ref={stageRef}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
        >
          {/* Circles (fill + stroke) */}
          <circle
            className={`venn-circle ${isActive('ai') ? 'is-active' : ''}`}
            cx={C.ai.cx} cy={C.ai.cy} r={r}
            fill="var(--ai-fill)"
            stroke="var(--ai)"
          />
          <circle
            className={`venn-circle ${isActive('rpa') ? 'is-active' : ''}`}
            cx={C.rpa.cx} cy={C.rpa.cy} r={r}
            fill="var(--rpa-fill)"
            stroke="var(--rpa)"
          />
          <circle
            className={`venn-circle ${isActive('api') ? 'is-active' : ''}`}
            cx={C.api.cx} cy={C.api.cy} r={r}
            fill="var(--api-fill)"
            stroke="var(--api)"
          />

          {/* Title labels for each circle */}
          <g className={`venn-label-group ${isActive('ai') ? 'is-active' : ''}`}>
            <text x={300} y={70} className="venn-label-title" textAnchor="middle" fill="var(--ai-ink)">AI</text>
            {renderBullets('ai', 300, 92, 'middle')}
          </g>

          <g className={`venn-label-group ${isActive('rpa') ? 'is-active' : ''}`}>
            <text x={70} y={395} className="venn-label-title" textAnchor="start" fill="var(--rpa-ink)">RPA</text>
            {renderBullets('rpa', 70, 415, 'start')}
          </g>

          <g className={`venn-label-group ${isActive('api') ? 'is-active' : ''}`}>
            <text x={530} y={395} className="venn-label-title" textAnchor="end" fill="var(--api-ink)">API</text>
            {renderBullets('api', 530, 415, 'end')}
          </g>

          {/* Overlap labels */}
          {/* AI + RPA — top-left intersection */}
          <g className={`venn-label-group ${hover === 'ai-rpa' || hover === 'all' ? 'is-active' : ''}`} style={{ pointerEvents: 'none' }}>
            <text x={210} y={258} className="venn-overlap-label" textAnchor="middle">AI + RPA</text>
            <text x={210} y={273} className="venn-overlap-sub" textAnchor="middle">Cognitive task</text>
            <text x={210} y={285} className="venn-overlap-sub" textAnchor="middle">automation</text>
          </g>

          {/* AI + API — top-right intersection */}
          <g className={`venn-label-group ${hover === 'ai-api' || hover === 'all' ? 'is-active' : ''}`} style={{ pointerEvents: 'none' }}>
            <text x={390} y={258} className="venn-overlap-label" textAnchor="middle">AI + API</text>
            <text x={390} y={273} className="venn-overlap-sub" textAnchor="middle">Intelligent</text>
            <text x={390} y={285} className="venn-overlap-sub" textAnchor="middle">workflows</text>
          </g>

          {/* RPA + API — bottom intersection */}
          <g className={`venn-label-group ${hover === 'rpa-api' || hover === 'all' ? 'is-active' : ''}`} style={{ pointerEvents: 'none' }}>
            <text x={300} y={418} className="venn-overlap-label" textAnchor="middle">RPA + API</text>
            <text x={300} y={433} className="venn-overlap-sub" textAnchor="middle">Bridge legacy</text>
            <text x={300} y={445} className="venn-overlap-sub" textAnchor="middle">+ modern</text>
          </g>

          {/* Center — best-fit */}
          <g className={`venn-label-group ${hover === 'all' ? 'is-active' : ''}`} style={{ pointerEvents: 'none' }}>
            <circle cx={300} cy={326} r={4} fill="var(--ink)" opacity="0.85" />
            <text x={300} y={350} className="venn-center" textAnchor="middle">Best-fit</text>
            <text x={300} y={368} className="venn-center" textAnchor="middle">strategy</text>
          </g>
        </svg>

        {/* Tooltip */}
        {tooltipContent && (
          <div
            className={`venn-tooltip ${tooltip.visible ? 'visible' : ''}`}
            style={{ left: tooltip.x + 'px', top: tooltip.y + 'px' }}
          >
            <div className="tt-label">{tooltipContent.label}</div>
            <div className="tt-title">{tooltipContent.title}</div>
            <div>{tooltipContent.body}</div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="venn-legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ background: 'var(--rpa)' }}></span>
          <span>RPA — rule-based</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: 'var(--ai)' }}></span>
          <span>AI — judgment</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: 'var(--api)' }}></span>
          <span>API — direct integration</span>
        </div>
      </div>
    </div>
  );
};

window.VennDiagram = VennDiagram;
