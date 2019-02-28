import React, { ErrorInfo } from "react";
import {
  Switch,
  Route,
  withRouter,
  RouteComponentProps
} from "react-router-dom";
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
import { T, Locale } from "../i18n/i18n";
import { AnyObj } from "../models/TypeBucket";
import { User } from "./DuluApp";

interface IProps extends RouteComponentProps {
  t: T;
  updateViewPrefs: (p: AnyObj) => void;
  user: User;
  updateLanguage: (l: Locale) => void;
}

interface IState {
  hasError?: boolean;
}

class MainRouter extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const content = {
      error: error.toString(),
      stack: error.stack,
      componentStack: info.componentStack,
      user: this.props.user,
      history: this.props.history
    };
    axios.post("/api/errors", { content: content });
  }

  componentDidUpdate(_prevProps: IProps, prevState: IState) {
    if (prevState.hasError) this.setState({ hasError: false });
  }

  render() {
    return this.state.hasError ? (
      <ErrorMessage />
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
              viewPrefs={this.props.user.view_prefs}
              updateViewPrefs={this.props.updateViewPrefs}
            />
          )}
        />
        <Route
          path="/programs/:idOrAction?"
          render={({ match }) => (
            <ProgramsRedirect t={this.props.t} match={match} />
          )}
        />
        <Route
          path="/regions/:idOrAction?"
          render={({ history, match }) => (
            <RegionsContainer
              history={history}
              {...matchParamsForChild(match)}
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
            />
          )}
        />
        <Route path="/events" render={() => <EventsPage t={this.props.t} />} />
        <Route
          path="/reports/:id?"
          render={({ match, history, location }) => (
            <ReportsViewer
              key={match.params.id || ""}
              t={this.props.t}
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
              id={match.params.id}
            />
          )}
        />
        <Route
          path="/*activities/:id"
          render={({ match, history }) => (
            <ActivityPage history={history} id={match.params.id} />
          )}
        />
        <Route
          render={() => (
            <Dashboard
              user={this.props.user}
              viewPrefs={this.props.user.view_prefs}
              updateViewPrefs={this.props.updateViewPrefs}
            />
          )}
        />
      </Switch>
    );
  }
}

export default withRouter(MainRouter);

function routeActionAndId(routeParams: AnyObj) {
  if (routeParams.actionOrId && routeParams.id)
    return { action: routeParams.actionOrId, id: routeParams.id };
  if (parseInt(routeParams.actionOrId))
    return { action: "show", id: routeParams.actionOrId };
  return { action: routeParams.actionOrId };
}

function matchParamsForChild(
  match: any
): { basePath: string; id?: number; action: string } {
  let params: any = { basePath: match.url };
  const id = parseInt(match.params.idOrAction);
  if (id) params.id = id;
  else params.action = match.params.idOrAction;
  return params;
}
