import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import DuluApp from "./DuluApp";
import { Provider } from "react-redux";
import { createStore } from "redux";
import appReducer from "../reducers/appReducer";
import PropTypes from "prop-types";

const store = createStore(appReducer);

function App({ store }) {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <DuluApp />
      </BrowserRouter>
    </Provider>
  );
}

App.propTypes = { store: PropTypes.object.isRequired };

const appDiv = document.getElementById("app");

ReactDOM.render(<App store={store} />, appDiv);
