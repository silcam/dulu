import React from "react";
// import PropTypes from "prop-types";
import LanguagePage from "./LanguagePage";
import { Switch, Route } from "react-router-dom";
import LanguageParticipantPage from "./LanguageParticipantPage";
import LanguageEventPage from "./LanguageEventPage";
import LanguageActivityPage from "./LanguageActivityPage";
import LanguageNewEventPage from "./LanguageNewEventPage";
import Loading from "../shared/Loading";
import { DomainStatusItemPageContainer } from "./DomainStatusContainer";

export default function LanguagePageRouter(props) {
  if (!props.language) return <Loading />;
  return (
    <Switch>
      <Route
        path={props.basePath + "/participants/:participantId"}
        render={({ match, history }) => (
          <LanguageParticipantPage
            participantId={parseInt(match.params.participantId)}
            history={history}
            {...props}
          />
        )}
      />
      <Route
        path={props.basePath + "/events/new"}
        render={({ location, history }) => (
          <LanguageNewEventPage
            {...props}
            location={location}
            history={history}
          />
        )}
      />
      <Route
        path={props.basePath + "/events/:eventId"}
        render={({ match, history }) => (
          <LanguageEventPage
            eventId={match.params.eventId}
            history={history}
            {...props}
          />
        )}
      />
      <Route
        path={props.basePath + "/activities/:activityId"}
        render={({ match }) => (
          <LanguageActivityPage
            activityId={match.params.activityId}
            {...props}
          />
        )}
      />
      <Route
        path={props.basePath + "/domain_status_items/:domainStatusItemId"}
        render={({ match, history }) => (
          <DomainStatusItemPageContainer
            domainStatusItemId={parseInt(match.params.domainStatusItemId)}
            history={history}
            {...props}
          />
        )}
      />
      <Route
        render={({ history }) => <LanguagePage history={history} {...props} />}
      />
    </Switch>
  );
}
