import React from "react";
import PropTypes from "prop-types";
import { Switch, Route, withRouter } from "react-router-dom";
import Dashboard from "../components/dashboard/Dashboard";
import PeopleContainer from "../components/people/PeopleContainer";
import ReportsViewer from "../components/reports/ReportsViewer";
import EventsPage from "../components/events/EventsPage";
import ParticipantPage from "../components/participants/ParticipantPage";
import ActivityPage from "../components/activities/ActivityPage";
import OrganizationsContainer from "../components/organizations/OrganizationsContainer";
import ProgramsRedirect from "../components/languages/ProgramsRedirect";
import LanguagesContainer from "../components/languages/LanguagesContainer";
import ErrorMessage from "./ErrorMessage";
import axios from "axios";
import ClustersContainer from "../components/clusters/ClustersContainer";
import RegionsContainer from "../components/regions/RegionsContainer";

class MainRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    const content = {
      error: error.toString(),
      stack: error.stack,
      componentStack: info.componentStack,
      user: this.props.user,
      history: this.props.history
    };
    axios.post("/api/errors", { content: content });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.hasError) this.setState({ hasError: false });
  }

  render() {
    return this.state.hasError ? (
      <ErrorMessage t={this.props.t} />
    ) : (
      <Switch>
        <Route
          path="/languages/:idOrAction?"
          render={({ match, history, location }) => (
            <LanguagesContainer
              history={history}
              location={location}
              {...matchParamsForChild(match)}
              t={this.props.t}
              setNetworkError={this.props.setNetworkError}
              viewPrefs={this.props.user.view_prefs}
              updateViewPrefs={this.props.updateViewPrefs}
            />
          )}
        />
        <Route
          path="/programs/:idOrAction?"
          render={({ match }) => (
            <ProgramsRedirect
              t={this.props.t}
              setNetworkError={this.props.setNetworkError}
              match={match}
            />
          )}
        />
        <Route
          path="/regions/:idOrAction?"
          render={({ history, match, location }) => (
            <RegionsContainer
              history={history}
              location={location}
              {...matchParamsForChild(match)}
              t={this.props.t}
              setNetworkError={this.props.setNetworkError}
            />
          )}
        />
        <Route
          path="/clusters/:idOrAction?"
          render={({ history, match, location }) => (
            <ClustersContainer
              history={history}
              location={location}
              {...matchParamsForChild(match)}
              t={this.props.t}
              setNetworkError={this.props.setNetworkError}
            />
          )}
        />
        <Route
          path="/people/:actionOrId?/:id?"
          render={({ match, history }) => (
            <PeopleContainer
              history={history}
              {...routeActionAndId(match.params)}
              t={this.props.t}
              updateLanguage={this.props.updateLanguage}
              setNetworkError={this.props.setNetworkError}
            />
          )}
        />
        <Route
          path="/organizations/:actionOrId?/:id?"
          render={({ match, history }) => (
            <OrganizationsContainer
              history={history}
              {...routeActionAndId(match.params)}
              t={this.props.t}
              setNetworkError={this.props.setNetworkError}
            />
          )}
        />
        <Route
          path="/events"
          render={() => (
            <EventsPage
              t={this.props.t}
              setNetworkError={this.props.setNetworkError}
            />
          )}
        />
        <Route
          path="/reports/:id?"
          render={({ match, history, location }) => (
            <ReportsViewer
              key={match.params.id || ""}
              t={this.props.t}
              setNetworkError={this.props.setNetworkError}
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
              t={this.props.t}
              history={history}
              setNetworkError={this.props.setNetworkError}
              id={match.params.id}
            />
          )}
        />
        <Route
          path="/*activities/:id"
          render={({ match, history }) => (
            <ActivityPage
              t={this.props.t}
              history={history}
              setNetworkError={this.props.setNetworkError}
              id={match.params.id}
            />
          )}
        />
        <Route
          render={props => (
            <Dashboard
              {...props}
              t={this.props.t}
              viewPrefs={this.props.user.view_prefs}
              updateViewPrefs={this.props.updateViewPrefs}
              setNetworkError={this.props.setNetworkError}
            />
          )}
        />
      </Switch>
    );
  }
}

export default withRouter(MainRouter);

function routeActionAndId(routeParams) {
  if (routeParams.actionOrId && routeParams.id)
    return { action: routeParams.actionOrId, id: routeParams.id };
  if (parseInt(routeParams.actionOrId))
    return { action: "show", id: routeParams.actionOrId };
  return { action: routeParams.actionOrId };
}

function matchParamsForChild(match) {
  let params = { basePath: match.url };
  const id = parseInt(match.params.idOrAction);
  if (id) params.id = id;
  else params.action = match.params.idOrAction;
  return params;
}

MainRouter.propTypes = {
  t: PropTypes.func.isRequired,
  setNetworkError: PropTypes.func.isRequired,
  updateViewPrefs: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  updateLanguage: PropTypes.func.isRequired,
  // From withRouter
  history: PropTypes.object.isRequired
};
