import React from "react";

import YourForm from "./YourForm";
import MyForm from "./MyForm";

import "./App.css";

const App: React.FC = () => {
  return (
    <div className="App">
      <YourForm />
      <br />
      <MyForm />
    </div>
  );
};

export default App;
