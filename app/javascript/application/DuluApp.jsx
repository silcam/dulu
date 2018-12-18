import React from "react";
import { Switch, Route } from "react-router-dom";
import NavBar from "../components/layout/NavBar";
import Dashboard from "../components/dashboard/Dashboard";
import PeopleBoard from "../components/people/PeopleBoard";
import translator from "../i18n/i18n";
import styles from "./DuluApp.css";
import OrganizationsBoard from "../components/organizations/OrganizationsBoard";
import NetworkErrorAlert from "../components/shared/NetworkErrorAlert";
import DuluAxios from "../util/DuluAxios";
import LanguagesBoard from "../components/languages/LanguagesBoard";
import ReportsViewer from "../components/reports/ReportsViewer";
import EventsPage from "../components/events/EventsPage";
import RegionsBoard from "../components/regions/RegionsBoard";
import ClustersBoard from "../components/clusters/ClustersBoard";

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
        <NavBar user={this.state.user} t={this.state.t} />
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
            path="/(languages|programs)/:idOrAction?"
            render={({ match, history, location }) => (
              <LanguagesBoard
                history={history}
                location={location}
                {...matchParamsForChild(match)}
                t={this.state.t}
                setNetworkError={this.setNetworkError}
              />
            )}
          />
          <Route
            path="/regions/:idOrAction?"
            render={({ history, match, location }) => (
              <RegionsBoard
                history={history}
                location={location}
                {...matchParamsForChild(match)}
                t={this.state.t}
                setNetworkError={this.setNetworkError}
              />
            )}
          />
          <Route
            path="/clusters/:idOrAction?"
            render={({ history, match, location }) => (
              <ClustersBoard
                history={history}
                location={location}
                {...matchParamsForChild(match)}
                t={this.state.t}
                setNetworkError={this.setNetworkError}
              />
            )}
          />
          <Route
            path="/people/:actionOrId?/:id?"
            render={({ match, history }) => (
              <PeopleBoard
                history={history}
                {...routeActionAndId(match.params)}
                t={this.state.t}
                updateLanguage={this.updateLanguage}
                setNetworkError={this.setNetworkError}
              />
            )}
          />
          <Route
            path="/organizations/:actionOrId?/:id?"
            render={({ match, history }) => (
              <OrganizationsBoard
                history={history}
                {...routeActionAndId(match.params)}
                t={this.state.t}
                setNetworkError={this.setNetworkError}
              />
            )}
          />
          <Route
            path="/events"
            render={() => (
              <EventsPage
                t={this.state.t}
                setNetworkError={this.setNetworkError}
              />
            )}
          />
          <Route
            path="/reports/:id?"
            render={({ match, history, location }) => (
              <ReportsViewer
                key={match.params.id || ""}
                t={this.state.t}
                setNetworkError={this.setNetworkError}
                id={match.params.id}
                history={history}
                location={location}
              />
            )}
          />
          <Route
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

function routeActionAndId(routeParams) {
  if (routeParams.actionOrId && routeParams.id)
    return { action: routeParams.actionOrId, id: routeParams.id };
  if (parseInt(routeParams.actionOrId))
    return { action: "show", id: routeParams.actionOrId };
  return { action: routeParams.actionOrId };
}

function matchParamsForChild(match) {
  let params = { basePath: match.url };
  let id = parseInt(match.params.idOrAction);
  if (id) params.id = match.params.idOrAction;
  else params.action = match.params.idOrAction;
  return params;
}

function getUser() {
  return JSON.parse(document.getElementById("userData").innerHTML);
}
