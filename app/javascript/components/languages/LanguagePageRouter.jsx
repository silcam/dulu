import React from "react";
import PropTypes from "prop-types";
import LanguagePage from "./LanguagePage";
import { Switch, Route } from "react-router-dom";
import LanguageParticipantPage from "./LanguageParticipantPage";

export default function LanguagePageRouter(props) {
  return (
    <Switch>
      <Route
        path={props.basePath + "/participants/:participantId"}
        render={({ match, history }) => (
          <LanguageParticipantPage
            participantId={match.params.participantId}
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
