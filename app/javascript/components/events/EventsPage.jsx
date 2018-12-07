import React from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
import EventsCalendar from "./EventsCalendar";
import { thisYear, thisMonth } from "./dateUtils";

export default function EventsPage(props) {
  return (
    <Switch>
      <Route
        path="/events/cal/:year/:month"
        render={({ match }) => (
          <EventsCalendar
            {...props}
            year={match.params.year}
            month={match.params.month}
          />
        )}
      />
      <Route
        path="/events/:id"
        render={({ match }) => (
          <p>This is the page for event {match.params.id}</p>
        )}
      />
      <Route
        render={() => (
          <Redirect to={`/events/cal/${thisYear()}/${thisMonth()}`} />
        )}
      />
    </Switch>
  );
}
