import { useState } from "react";
import { HashRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { routeList } from "./router";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <HashRouter>
        <Routes>{routeList}</Routes>
      </HashRouter>
    </>
  );
}

export default App;
