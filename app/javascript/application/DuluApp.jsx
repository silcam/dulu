import React from "react";
import { Switch, Route } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/layout/NavBar";
import Dashboard from "../components/dashboard/Dashboard";
import PeopleBoard from "../components/people/PeopleBoard";
import translator from "../i18n/i18n";
import styles from "./DuluApp.css";
import OrganizationsBoard from "../components/organizations/OrganizationsBoard";
import NetworkErrorAlert from "../components/shared/NetworkErrorAlert";
import DuluAxios from "../util/DuluAxios";

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
        locale: user.ui_language
      };
    });
    DuluAxios.clearNetworkError = () => {
      this.setState({ networkError: undefined });
    };
  }

  updateLanguage = locale => {
    if (locale != this.state.locale)
      this.setState({
        locale: locale,
        t: translator(locale)
      });
  };

  setNetworkError = networkError => {
    this.setState({ networkError: networkError });
  };

  render() {
    return (
      <div className={styles.container}>
        <NavBar user={this.state.user} />
        {this.state.networkError && (
          <div>
            <NetworkErrorAlert
              t={this.state.t}
              tryAgain={this.state.networkError.tryAgain}
            />
          </div>
        )}
        <Switch>
          <Route
            path="/people/:action?/:id?"
            render={({ match, history }) => (
              <PeopleBoard
                history={history}
                action={match.params.action}
                id={match.params.id}
                t={this.state.t}
                updateLanguage={this.updateLanguage}
                setNetworkError={this.setNetworkError}
              />
            )}
          />
          <Route
            path="/organizations/:action?/:id?"
            render={({ match, history }) => (
              <OrganizationsBoard
                history={history}
                {...match.params}
                t={this.state.t}
                setNetworkError={this.setNetworkError}
              />
            )}
          />
          <Route
            path="/"
            render={props => (
              <Dashboard
                {...props}
                t={this.state.t}
                viewPrefs={{}}
                setNetworkError={this.setNetworkError}
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

function getUser() {
  return JSON.parse(document.getElementById("userData").innerHTML);
}
