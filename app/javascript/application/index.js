// Babel 7 replacement for `babel-polyfill`. babel.config.js sets
// `useBuiltIns: "entry", corejs: 3` for the dev/production presets, which rewrites
// this pair of imports into only the polyfills the browser targets actually need.
import "core-js/stable";
import "regenerator-runtime/runtime";
import React from "react";
import { createRoot } from "react-dom/client";
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

// React 18. `ReactDOM.render` still works here -- it warns and falls back to the
// legacy renderer -- so an app that loads is not evidence this call site changed.
// StrictMode is deliberately left off: `useLoadOnMount` is used throughout, and
// StrictMode's double-invoked mount effects would double every one of those
// fetches. Adopting it is a separate decision, not part of this upgrade.
createRoot(appDiv).render(<App store={store} />);
