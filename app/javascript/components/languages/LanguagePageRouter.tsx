import React from "react";
// import PropTypes from "prop-types";
import LanguagePage from "./LanguagePage";
import { Switch, Route } from "react-router-dom";
import LanguageParticipantPage from "./LanguageParticipantPage";
import LanguageEventPage from "./LanguageEventPage";
import LanguageActivityPage from "./LanguageActivityPage";
import LanguageNewEventPage from "./LanguageNewEventPage";
import Loading from "../shared/Loading";
import {
  DomainStatusItemPageContainer,
  DomainStatusDataCollectionContainer
} from "./DomainStatusContainer";
import { ILanguage } from "../../models/Language";

interface IProps {
  language: ILanguage;
  basePath: string;
}

export default function LanguagePageRouter(props: IProps) {
  if (props.language.id == 0) return <Loading />;
  const language = props.language;
  return (
    <Switch>
      <Route
        path={props.basePath + "/participants/:participantId"}
        render={({ match, history }) => (
          <LanguageParticipantPage
            {...props}
            participantId={parseInt(match.params.participantId)}
            history={history}
            language={language}
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
            language={language}
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
            language={language}
          />
        )}
      />
      <Route
        path={props.basePath + "/activities/:activityId"}
        render={({ match }) => (
          <LanguageActivityPage
            activityId={match.params.activityId}
            {...props}
            language={language}
          />
        )}
      />
      <Route
        path={props.basePath + "/domain_status_items/lingdata/:collectionType"}
        render={({ match }) => (
          <DomainStatusDataCollectionContainer
            collectionType={match.params.collectionType}
            language={language}
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
            language={language}
          />
        )}
      />
      <Route
        render={({ history, location }) => (
          <LanguagePage
            history={history}
            {...props}
            location={location}
            language={language}
          />
        )}
      />
    </Switch>
  );
}
