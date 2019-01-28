import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import DuluApp from "./DuluApp";

function App() {
  return (
    <BrowserRouter>
      <DuluApp />
    </BrowserRouter>
  );
}

const appDiv = document.getElementById("app");

ReactDOM.render(<App />, appDiv);
