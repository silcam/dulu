import React from "react";
import { Switch, Route, NavLink } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/layout/NavBar";
import Dashboard from "../components/dashboard/Dashboard";
import PeopleBoard from "../components/people/PeopleBoard";
import translator from "../i18n/i18n";

export default class DuluApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      t: translator("en")
    };
  }

  render() {
    return (
      <div className="fullHeight">
        <NavBar user={this.state.user} />

        <Switch>
          <Route path="/people">
            <PeopleBoard
              t={this.state.t}
              authToken={getAuthToken()}
              tab="people"
            />
          </Route>
          <Route path="/">
            <Dashboard
              authToken={getAuthToken()}
              t={this.state.t}
              viewPrefs={{}}
            />
          </Route>
        </Switch>
      </div>
    );
  }
}

async function logout() {
  await axios.post("/logout", {
    authenticity_token: getAuthToken()
  });
  document.location = "/";
}

function FakeDashboard(props) {
  return (
    <div>
      <p>{props.t("common.Loading")}</p>
      <p>
        <button onClick={props.swapLocale}>Button</button>
      </p>
    </div>
  );
}

function People() {
  return <h1>Da Peeeps Page</h1>;
}

function Login(props) {
  return (
    <div>
      <a href="http://localhost:3000/login">Log in</a>
    </div>
  );
}

function getAuthToken() {
  return document
    .querySelector("meta[name=csrf-token]")
    .getAttribute("content");
}
