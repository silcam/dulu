import React from "react";
import PropTypes from "prop-types";
import { findById, replace, deleteFrom } from "../../util/arrayUtils";
import EventView from "../events/EventView";
import update from "immutability-helper";
import { Link } from "react-router-dom";

export default function LanguageEventPage(props) {
  const t = props.t;
  const language = props.language;
  const event = findById(props.language.events, props.eventId);

  if (!event) return null; // We hit this state during a delete operation :(
  // Refactor - make this a class
  // If the event does not exist on mount, try to download it

  const replaceEvent = newEvent => {
    props.replaceLanguage(
      update(language, { events: replace(language.events, newEvent) })
    );
  };

  const removeEvent = () => {
    props.replaceLanguage(
      update(language, {
        events: { $set: deleteFrom(language.events, event.id) }
      })
    );
    props.history.goBack();
  };

  return (
    <div>
      <h4>
        <Link to={props.basePath}>{`< ${language.name}`}</Link>
      </h4>
      <EventView
        event={event}
        t={t}
        setNetworkError={props.setNetworkError}
        can={event.can}
        replaceEvent={replaceEvent}
        removeEvent={removeEvent}
      />
    </div>
  );
}

LanguageEventPage.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.object.isRequired,
  eventId: PropTypes.string.isRequired,
  basePath: PropTypes.string.isRequired,
  setNetworkError: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  replaceLanguage: PropTypes.func.isRequired
};
