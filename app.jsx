const App = () => {
  return (
    <div className="page">
      <header className="header">
        <div>
          <div className="eyebrow">Framework · 2026</div>
          <h1 className="title">
            AI <em>vs</em> RPA <em>vs</em> API
            <br />
            — an evaluation model.
          </h1>
          <p className="subtitle">
            Choose the right automation approach for the right problem. Hover the diagram to compare,
            move the sliders to score your workload.
          </p>
        </div>
        <div className="header-meta">
          <div>03 SECTIONS</div>
          <div>05 DIMENSIONS</div>
          <div>INTERACTIVE</div>
        </div>
      </header>

      <main className="main-grid">
        <VennDiagram />
        <Evaluator />
      </main>

      <ChooseCards />
      <Glance />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
