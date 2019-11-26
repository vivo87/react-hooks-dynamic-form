import React from "react";

import JsForm from "./JsForm";
import TsForm from "./TsForm";

import "./App.css";

const App: React.FC = () => {
  return (
    <div className="App">
      <JsForm />
      <br />
      <TsForm />
    </div>
  );
};

export default App;
