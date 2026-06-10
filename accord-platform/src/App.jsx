import "./App.css";
import EngineViewer from "./EngineViewer";

function App() {
  return (
    <main className="app">
      <h1 className="app-title">Accord Built</h1>
      <h3 className="app-subtitle">A 3D engine viewer</h3>

      <button className="exploded-btn">
        Exploded View
      </button>

      <EngineViewer />

      <div className="controls-box">
        <strong>Controls</strong>
        <br />
        Left click + drag: move
        <br />
        Right click + drag: rotate
        <br />
        Scroll: zoom
      </div>
    </main>
  );
}

export default App;