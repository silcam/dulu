import React from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { thisYear, thisMonth } from "./dateUtils";
import EventsCalendarContainer from "./EventsCalendarContainer";

// Its <Switch> moved into MainRouter's route tree. What remains is the layout
// slot the events pages render into.
export default function EventsPage() {
  return <Outlet />;
}

// EventsCalendar takes year and month as ordinary props and connect() sits
// between it and the router, so the params are read here rather than in it.
export function EventsCalendarRoute() {
  const { year, month } = useParams();

  return <EventsCalendarContainer year={year!} month={month!} />;
}

// What the v5 fallback <Redirect> did: an /events URL that matches nothing else
// lands on the current month rather than falling through to the dashboard.
export function EventsIndexRedirect() {
  return <Navigate to={`/events/cal/${thisYear()}/${thisMonth()}`} replace />;
}
