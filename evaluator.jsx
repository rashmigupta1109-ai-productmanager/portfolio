// Evaluator panel — sliders + recommendation
const Evaluator = () => {
  const [values, setValues] = React.useState({
    data_type: 0.7,
    decision: 0.6,
    access: 0.3,
    change: 0.5,
    scale: 0.55,
  });
  const [lastWinner, setLastWinner] = React.useState(null);
  const [changed, setChanged] = React.useState(false);

  const setValue = (key, v) => {
    setValues(prev => ({ ...prev, [key]: v }));
  };

  // Aggregate scores
  const { scores, winner, reason, ranked } = React.useMemo(() => {
    const acc = { rpa: 0, ai: 0, api: 0 };
    DIMENSIONS.forEach(d => {
      const s = d.score(values[d.key]);
      acc.rpa += s.rpa;
      acc.ai += s.ai;
      acc.api += s.api;
    });
    // normalize to 0..1
    const max = Math.max(acc.rpa, acc.ai, acc.api, 0.001);
    const norm = {
      rpa: acc.rpa / max,
      ai: acc.ai / max,
      api: acc.api / max,
    };
    const r = buildReason(norm, values);
    return { scores: norm, ...r };
  }, [values]);

  // bounce when winner changes
  React.useEffect(() => {
    if (lastWinner !== null && lastWinner !== winner) {
      setChanged(true);
      const t = setTimeout(() => setChanged(false), 400);
      return () => clearTimeout(t);
    }
    setLastWinner(winner);
  }, [winner]);

  const winnerCat = CATEGORIES[winner];

  return (
    <div className="evaluator">
      <div className="panel-eyebrow">
        <span className="num">02</span>
        <span>How to Evaluate</span>
        <span className="line"></span>
      </div>
      <h2>Score the workload.</h2>
      <p className="evaluator-sub">Move each slider to match your situation. The recommendation updates live.</p>

      {DIMENSIONS.map((d, i) => (
        <SliderRow
          key={d.key}
          dim={d}
          value={values[d.key]}
          onChange={(v) => setValue(d.key, v)}
          index={i + 1}
        />
      ))}

      {/* Recommendation */}
      <div className={`result is-${winner} ${changed ? 'changed' : ''}`}>
        <div className="result-head">
          <span className="result-label">Recommendation</span>
          <span className="result-label" style={{ color: 'var(--ink-2)' }}>
            {Math.round(scores[winner] * 100)}% fit
          </span>
        </div>
        <div className="result-name">
          Choose {winnerCat.name}
          <span className="arrow">→</span>
        </div>
        <p className="result-reason">{reason}</p>

        <div className="score-bars">
          {ranked.map(([k, v]) => (
            <div className="score-row" key={k}>
              <span className="score-name">{CATEGORIES[k].name}</span>
              <div className="score-bar">
                <div
                  className={`score-bar-fill s-${k}`}
                  style={{ width: (v * 100) + '%' }}
                ></div>
              </div>
              <span className="score-val">{Math.round(v * 100)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SliderRow = ({ dim, value, onChange, index }) => {
  // Determine "active side" for label highlighting
  const leftActive = value < 0.4;
  const rightActive = value > 0.6;

  // Visualize fill: from center outward
  const pct = value * 100;
  // We render a fill bar whose left/right edges depend on whether v < 0.5 or > 0.5
  const fillStyle = value >= 0.5
    ? { left: '50%', width: ((value - 0.5) * 200) + '%', background: 'var(--ink)' }
    : { left: (value * 100) + '%', width: ((0.5 - value) * 200) + '%', background: 'var(--ink)' };

  return (
    <div className="slider-row">
      <div className="slider-head">
        <div>
          <div className="slider-name">{dim.name}</div>
        </div>
        <span className="slider-num">{String(index).padStart(2, '0')} / 05</span>
      </div>

      <div className="range-track-wrap">
        <div className="range-row">
          <input
            type="range"
            min="0" max="1" step="0.01"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
          />
          <div className="range-track">
            <div className="range-ticks">
              {[0,1,2,3,4].map(i => (
                <span key={i} className={`range-tick ${i === 2 ? 'middle' : ''}`}></span>
              ))}
            </div>
            <div className="range-fill" style={fillStyle}></div>
          </div>
          <div className="range-thumb" style={{ left: pct + '%' }}></div>
        </div>
      </div>

      <div className="range-labels">
        <span className={leftActive ? 'lab-active' : ''}>{dim.leftLabel}</span>
        <span className={rightActive ? 'lab-active' : ''}>{dim.rightLabel}</span>
      </div>
    </div>
  );
};

window.Evaluator = Evaluator;
