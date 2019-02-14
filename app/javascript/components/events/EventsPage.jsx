import React from "react";
// import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
import { thisYear, thisMonth } from "./dateUtils";
import EventPage from "./EventPage";
import EventsCalendarContainer from "./EventsCalendarContainer";
import CrashCauser from "./CrashCauser";

export default function EventsPage(props) {
  return (
    <Switch>
      <Route
        path="/events/cal/:year/:month"
        render={({ match }) => (
          <EventsCalendarContainer
            {...props}
            year={match.params.year}
            month={match.params.month}
          />
        )}
      />
      <Route path="/events/new" render={() => "To be added..."} />

      {/* For Testing purposes obviously! */}
      <Route path="/events/crash-me-now" render={() => <CrashCauser />} />

      <Route
        path="/events/:id"
        render={({ match, history }) => (
          <EventPage id={match.params.id} history={history} {...props} />
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
