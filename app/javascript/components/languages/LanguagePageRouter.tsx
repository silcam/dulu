import React from "react";
import LanguagePage from "./LanguagePage";
import { Switch, Route } from "react-router-dom";
import LanguageParticipantPage from "./LanguageParticipantPage";
import LanguageEventPage from "./LanguageEventPage";
import LanguageActivityPage from "./LanguageActivityPage";
import LanguageNewEventPage from "./LanguageNewEventPage";
import TaggedEventPage from "../events/TaggedEventsPage";
import Loading from "../shared/Loading";
import DomainStatusItemPage from "./DomainStatusItemPage";
import DomainStatusDataCollectionPage from "./DomainStatusDataCollectionPage";
import { useLoadOnMount } from "../shared/useLoad";
import useAppSelector from "../../reducers/useAppSelector";

interface IProps {
  basePath: string;
  id: number;
}

export default function LanguagePageRouter(props: IProps) {
  const language = useAppSelector(state => state.languages.get(props.id));

  useLoadOnMount(`/api/languages/${props.id}`);

  if (language.id == 0) return <Loading />;

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
        // TODO: This should be one level above, not specific
        // to a language?
        path={props.basePath + "/taggedevents/:tag"}
        render={({ match }) => (
          <TaggedEventPage {...props} tag={match.params.tag} />
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
          <DomainStatusDataCollectionPage
            collectionType={match.params.collectionType}
            language={language}
            {...props}
          />
        )}
      />
      <Route
        path={props.basePath + "/domain_status_items/:domainStatusItemId"}
        render={({ match, history }) => (
          <DomainStatusItemPage
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
