import React from "react";
import { Switch, Route } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/layout/NavBar";
import Dashboard from "../components/dashboard/Dashboard";
import PeopleBoard from "../components/people/PeopleBoard";
import translator from "../i18n/i18n";
import styles from "./DuluApp.css";

export default class DuluApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      t: translator("en"),
      locale: "en"
    };
  }

  componentDidMount() {
    const user = getUser();
    this.setState(prevState => {
      const t =
        user.ui_language == prevState.locale
          ? prevState.t
          : translator(user.ui_language);
      return {
        user: user,
        t: t,
        locale: user.ui_language,
        authToken: getAuthToken()
      };
    });
  }

  updateLanguage = locale => {
    if (locale != this.state.locale)
      this.setState({
        locale: locale,
        t: translator(locale)
      });
  };

  render() {
    return (
      <div className={styles.container}>
        <NavBar user={this.state.user} />

        <Switch>
          <Route
            path="/people/:action?/:id?"
            render={({ match, history }) => (
              <PeopleBoard
                history={history}
                action={match.params.action}
                id={match.params.id}
                t={this.state.t}
                authToken={this.state.authToken}
                updateLanguage={this.updateLanguage}
              />
            )}
          />
          <Route
            path="/organizations"
            render={props => (
              <PeopleBoard
                {...props}
                t={this.state.t}
                authToken={this.state.authToken}
              />
            )}
          />
          <Route
            path="/"
            render={props => (
              <Dashboard
                {...props}
                authToken={this.state.authToken}
                t={this.state.t}
                viewPrefs={{}}
              />
            )}
          />
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

function getUser() {
  return JSON.parse(document.getElementById("userData").innerHTML);
}
