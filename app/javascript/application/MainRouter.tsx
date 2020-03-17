import React, { ErrorInfo } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import Dashboard from "../components/dashboard/Dashboard";
import ReportsRouter from "../components/reports/ReportsRouter";
import EventsPage from "../components/events/EventsPage";
import ParticipantPage from "../components/participants/ParticipantPage";
import ActivityPage from "../components/activities/ActivityPage";
import OrganizationsContainer from "../components/organizations/OrganizationsContainer";
import LanguagesContainer from "../components/languages/LanguagesContainer";
import ErrorMessage from "./ErrorMessage";
import axios from "axios";
import ClustersContainer from "../components/clusters/ClustersContainer";
import RegionsContainer from "../components/regions/RegionsContainer";
import { AnyObj } from "../models/TypeBucket";
import CoreData from "./CoreData";
import NotificationsPage from "../components/notifications/NotificationsPage";
import PeopleBoard from "../components/people/PeopleBoard";
import useAppSelector from "../reducers/useAppSelector";
import { History } from "history";
import { User } from "../reducers/currentUserReducer";

interface IProps {
  user: User;
  history: History;
}

interface IState {
  hasError?: boolean;
}

export default function MainRouter() {
  const user = useAppSelector(state => state.currentUser);
  const history = useHistory();

  return <BaseMainRouter {...{ user, history }} />;
}

class BaseMainRouter extends React.Component<IProps, IState> {
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
      <React.Fragment>
        <Switch>
          <Route
            path="/languages/:idOrAction?"
            render={({ match, history, location }) => (
              <LanguagesContainer
                history={history}
                location={location}
                {...matchParamsForChild(match)}
              />
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
              />
            )}
          />
          <Route
            path="/people/:actionOrId?/:id?"
            render={({ match, history }) => (
              <PeopleBoard
                history={history}
                {...routeActionAndId(match.params)}
              />
            )}
          />
          <Route
            path="/organizations/:actionOrId?/:id?"
            render={({ match, history }) => (
              <OrganizationsContainer
                history={history}
                {...routeActionAndId(match.params)}
              />
            )}
          />
          <Route path="/events" render={() => <EventsPage />} />
          <Route path="/reports" render={() => <ReportsRouter />} />
          <Route path="/feed" render={() => <NotificationsPage />} />
          <Route
            path="/participants/:id"
            render={({ match, history }) => (
              <ParticipantPage history={history} id={match.params.id} />
            )}
          />
          <Route
            path="/*activities/:id"
            render={({ match, history }) => (
              <ActivityPage history={history} id={match.params.id} />
            )}
          />
          <Route render={() => <Dashboard />} />
        </Switch>
        <CoreData />
      </React.Fragment>
    );
  }
}

function routeActionAndId(routeParams: AnyObj) {
  if (routeParams.actionOrId && routeParams.id)
    return { action: routeParams.actionOrId, id: parseInt(routeParams.id) };
  if (parseInt(routeParams.actionOrId))
    return { action: "show", id: parseInt(routeParams.actionOrId) };
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
