import React from "react";
import NavBar from "../components/layout/NavBar";
import translator, { T, Locale } from "../i18n/i18n";
import styles from "./DuluApp.css";
import NetworkErrorAlerts from "./NetworkErrorAlerts";
import DuluAxios, { DuluAxiosError } from "../util/DuluAxios";
import update from "immutability-helper";
import MainRouter from "./MainRouter";

interface IProps {}
interface IState {
  user: User;
  t: T;
  locale: Locale;
  connectionError?: boolean;
  serverError?: boolean;
}

interface User {
  ui_language: Locale;
  view_prefs: any;
}

export default class DuluApp extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    const user = getUser();

    DuluAxios.setNetworkError = (error: DuluAxiosError) => {
      if (error.type == "connection") this.setState({ connectionError: true });
      else this.setState({ serverError: true });
    };

    DuluAxios.clearNetworkError = () => {
      this.setState({ connectionError: undefined });
    };

    this.state = {
      user: user,
      t: translator(user.ui_language),
      locale: user.ui_language
    };
  }

  updateLanguage = (locale: Locale) => {
    if (locale != this.state.locale)
      this.setState({
        locale: locale,
        t: translator(locale)
      });
  };

  updateViewPrefs = (mergeViewPrefs: any) => {
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

  setNetworkError = () => {};

  render() {
    return (
      <div className={styles.container}>
        <NavBar user={this.state.user} t={this.state.t} />
        <NetworkErrorAlerts
          t={this.state.t}
          connectionError={this.state.connectionError}
          serverError={this.state.serverError}
          clearServerError={() => this.setState({ serverError: undefined })}
        />
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
  return JSON.parse(document!.getElementById("userData")!.innerHTML);
}
