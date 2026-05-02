// "Choose" cards + at-a-glance footer
const ChooseCards = () => {
  const order = ['api', 'rpa', 'ai'];
  return (
    <section className="choose-section">
      <div className="panel-eyebrow">
        <span className="num">03</span>
        <span>When to Pick Each</span>
        <span className="line"></span>
      </div>
      <div className="choose-grid">
        {order.map((k, i) => {
          const c = CATEGORIES[k];
          return (
            <div className={`choose-card is-${k}`} key={k}>
              <span className="corner-tag">0{i + 1}</span>
              <div className={`choose-icon is-${k}`}>
                <CategoryGlyph kind={k} />
              </div>
              <div className="choose-tag">{c.tagline}</div>
              <h3 className="choose-name">Choose {c.name}</h3>
              <p className="choose-when">{c.when}</p>
              <div className="choose-meta">
                <span><strong>Speed</strong> · {c.speed}</span>
                <span><strong>Cost</strong> · {c.cost}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// Simple geometric glyphs (no faux-illustration) — match the editorial flat aesthetic
const CategoryGlyph = ({ kind }) => {
  const stroke = 'currentColor';
  if (kind === 'rpa') {
    // Concentric squares — gear / repetitive cycle
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="3" width="14" height="14" rx="1.5" stroke={stroke} strokeWidth="1.5" />
        <rect x="7" y="7" width="6" height="6" rx="0.5" stroke={stroke} strokeWidth="1.5" />
      </svg>
    );
  }
  if (kind === 'ai') {
    // Diamond + dot — judgment / spark
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 3 L17 10 L10 17 L3 10 Z" stroke={stroke} strokeWidth="1.5" />
        <circle cx="10" cy="10" r="1.6" fill={stroke} />
      </svg>
    );
  }
  // api — two stacked lines connecting (system-to-system)
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="5" cy="6" r="2" stroke={stroke} strokeWidth="1.5" />
      <circle cx="15" cy="14" r="2" stroke={stroke} strokeWidth="1.5" />
      <path d="M6.5 7.5 L13.5 12.5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

const Glance = () => {
  const items = [
    { num: '01', title: 'Match the problem', body: 'Start from the workload\u2019s shape, not from the tooling you already own.' },
    { num: '02', title: 'Evaluate with evidence', body: 'Score along the five dimensions — data, decisions, access, change, scale.' },
    { num: '03', title: 'Choose & iterate', body: 'Pick a primary approach, combine where overlaps make sense, revisit quarterly.' },
  ];
  return (
    <section className="glance">
      <h3 className="glance-title">
        <small>At a glance</small>
        A practical method.
      </h3>
      {items.map(it => (
        <div key={it.num}>
          <div className="glance-item-num">{it.num}</div>
          <h4 className="glance-item-title">{it.title}</h4>
          <p className="glance-item-body">{it.body}</p>
        </div>
      ))}
    </section>
  );
};

window.ChooseCards = ChooseCards;
window.Glance = Glance;
