import React from "react";
import { Switch, Route } from "react-router-dom";
import PersonEventPage from "./PersonEventPage";
import NewPersonForm from "./NewPersonForm";
import { Locale } from "../../i18n/i18n";
import PersonPage from "./PersonPage";

export default function PeopleRouter(props: {
  updateLanguage: (loc: Locale) => void;
}) {
  return (
    <Switch>
      <Route path="/people/new" render={() => <NewPersonForm />} />
      <Route
        path="/people/:id/events/:eventId"
        render={({ match }) => (
          <PersonEventPage
            id={parseInt(match.params.id)}
            eventId={parseInt(match.params.eventId)}
          />
        )}
      />
      <Route
        path="/people/:id"
        render={({ match }) => (
          <PersonPage
            id={parseInt(match.params.id)}
            updateLanguage={props.updateLanguage}
          />
        )}
      />
    </Switch>
  );
}
