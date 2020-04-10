import React from "react";

import JsForm from "./components/JsForm";
import TsForm from "./components/TsForm";

import "./App.css";

const App: React.FC = () => {
  return (
    <div className="App">
      <JsForm />
      <br />
      <TsForm remoteData={{ login: "John Doe", phone: "01-02-03-04-05" }} />
    </div>
  );
};

export default App;
