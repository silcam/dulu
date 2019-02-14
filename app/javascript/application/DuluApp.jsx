import React from "react";
import NavBar from "../components/layout/NavBar";
import translator from "../i18n/i18n";
import styles from "./DuluApp.css";
import NetworkErrorAlert from "../components/shared/NetworkErrorAlert";
import DuluAxios from "../util/DuluAxios";
import update from "immutability-helper";
import MainRouter from "./MainRouter";

export default class DuluApp extends React.Component {
  constructor(props) {
    super(props);
    const user = getUser();

    DuluAxios.clearNetworkError = () => {
      this.setState({ networkError: undefined });
    };

    this.state = {
      user: user,
      t: translator(user.ui_language),
      locale: user.ui_language
    };
  }

  updateLanguage = locale => {
    if (locale != this.state.locale)
      this.setState({
        locale: locale,
        t: translator(locale)
      });
  };

  updateViewPrefs = mergeViewPrefs => {
    this.setState(prevState => {
      const newUser = update(prevState.user, {
        view_prefs: { $merge: mergeViewPrefs }
      });
      DuluAxios.put("/api/people/update_view_prefs", {
        view_prefs: newUser.view_prefs
      });
      return {
        user: newUser
      };
    });
  };

  setNetworkError = networkError => {
    this.setState({ networkError: networkError });
  };

  render() {
    return (
      <div className={styles.container}>
        <NavBar user={this.state.user} t={this.state.t} />
        {this.state.networkError && (
          <div>
            <NetworkErrorAlert
              t={this.state.t}
              tryAgain={this.state.networkError.tryAgain}
            />
          </div>
        )}
        <MainRouter
          t={this.state.t}
          setNetworkError={this.setNetworkError}
          user={this.state.user}
          updateViewPrefs={this.updateViewPrefs}
          updateLanguage={this.updateLanguage}
        />
      </div>
    );
  }
}

function getUser() {
  return JSON.parse(document.getElementById("userData").innerHTML);
}
