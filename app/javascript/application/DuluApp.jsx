import React from "react";
import { Switch, Route } from "react-router-dom";
import NavBar from "../components/layout/NavBar";
import Dashboard from "../components/dashboard/Dashboard";
import PeopleContainer from "../components/people/PeopleContainer";
import translator from "../i18n/i18n";
import styles from "./DuluApp.css";
import NetworkErrorAlert from "../components/shared/NetworkErrorAlert";
import DuluAxios from "../util/DuluAxios";
import LanguagesBoard from "../components/languages/LanguagesBoard";
import ReportsViewer from "../components/reports/ReportsViewer";
import EventsPage from "../components/events/EventsPage";
import RegionsBoard from "../components/regions/RegionsBoard";
import ClustersBoard from "../components/clusters/ClustersBoard";
import update from "immutability-helper";
import ParticipantPage from "../components/participants/ParticipantPage";
import ActivityPage from "../components/activities/ActivityPage";
import OrganizationsContainer from "../components/organizations/OrganizationsContainer";
import ProgramsRedirect from "../components/languages/ProgramsRedirect";

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
        <Switch>
          <Route
            path="/languages/:idOrAction?"
            render={({ match, history, location }) => (
              <LanguagesBoard
                history={history}
                location={location}
                {...matchParamsForChild(match)}
                t={this.state.t}
                setNetworkError={this.setNetworkError}
                viewPrefs={this.state.user.view_prefs}
                updateViewPrefs={this.updateViewPrefs}
              />
            )}
          />
          <Route
            path="/programs/:idOrAction?"
            render={({ match }) => (
              <ProgramsRedirect
                t={this.state.t}
                setNetworkError={this.setNetworkError}
                match={match}
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
              <PeopleContainer
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
              <OrganizationsContainer
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
            path="/participants/:id"
            render={({ match, history }) => (
              <ParticipantPage
                t={this.state.t}
                history={history}
                setNetworkError={this.setNetworkError}
                id={match.params.id}
              />
            )}
          />
          <Route
            path="/*activities/:id"
            render={({ match, history }) => (
              <ActivityPage
                t={this.state.t}
                history={history}
                setNetworkError={this.setNetworkError}
                id={match.params.id}
              />
            )}
          />
          <Route
            render={props => (
              <Dashboard
                {...props}
                t={this.state.t}
                viewPrefs={this.state.user.view_prefs}
                updateViewPrefs={this.updateViewPrefs}
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
