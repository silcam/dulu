import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import DuluApp from "./DuluApp";
import { Provider } from "react-redux";
import { createStore } from "redux";
import appReducer from "../reducers/appReducer";
import PropTypes from "prop-types";
import DispatchContext from "../contexts/DispatchContext";

const store = createStore(
  appReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

function App({ store }) {
  return (
    <Provider store={store}>
      <DispatchContext.Provider value={store.dispatch}>
        <BrowserRouter>
          <DuluApp />
        </BrowserRouter>
      </DispatchContext.Provider>
    </Provider>
  );
}

App.propTypes = { store: PropTypes.object.isRequired };

const appDiv = document.getElementById("app");

ReactDOM.render(<App store={store} />, appDiv);
