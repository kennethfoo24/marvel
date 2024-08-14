import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { useState } from "react";
import FormComponent from "./FormComponent";
import ActionPage from "./ActionPage";

function App() {
  const [username, setUsername] = useState("");
  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            element={<FormComponent setUsername={setUsername} />}
          />
          <Route path="/actions" element={<ActionPage username={username} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
