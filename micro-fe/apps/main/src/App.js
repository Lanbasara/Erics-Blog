import { BrowserRouter as Router, Link } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/vue">Vue</Link>
              </li>
              <li>
                <Link to="/vanilla">Vanilla</Link>
              </li>
              <li>
                <Link to="/react2">React3</Link>
              </li>
            </ul>
          </nav>
        </div>
      </Router>
      <div id="micro-container"></div>
    </div>
  );
}

export default App;
