import React from "react";
// import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
import { thisYear, thisMonth } from "./dateUtils";
import EventPage, { IProps as EventPageProps } from "./EventPage";
import EventsCalendarContainer from "./EventsCalendarContainer";
import CrashCauser from "./CrashCauser";
import { IProps as EventsCalendarProps } from "./EventsCalendar";

type IProps = EventsCalendarProps & EventPageProps;

export default function EventsPage(props: IProps) {
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
