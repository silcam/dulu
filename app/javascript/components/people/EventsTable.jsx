import React from "react";

import EventRows from "./EventRows";

class EventsTable extends React.PureComponent {
  render() {
    const person = this.props.person;
    const t = this.props.t;

    if (
      person.events.current.length == 0 &&
      person.events.past.length == 0 &&
      person.events.upcoming.length == 0
    ) {
      return null;
    }

    return (
      <div>
        <h3>{t("Events")}</h3>
        <table className="table">
          <tbody>
            <EventRows events={person.events.upcoming} t={t} />
            <EventRows events={person.events.current} t={t} />
            <EventRows events={person.events.past} pastEvents={true} t={t} />
          </tbody>
        </table>
      </div>
    );
  }
}

export default EventsTable;
