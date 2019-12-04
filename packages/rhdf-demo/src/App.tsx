import React from "react";

import JsForm from "./JsForm";
import TsForm from "./TsForm";

import "./App.css";

const App: React.FC = () => {
  return (
    <div className="App">
      <JsForm />
      <br />
      <TsForm remoteData={{ phone: "01-02-03-04-05" }} />
    </div>
  );
};

export default App;
