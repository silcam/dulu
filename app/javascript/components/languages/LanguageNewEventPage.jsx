import React from "react";
import PropTypes from "prop-types";
import NewEventForm from "../events/NewEventForm";
import { findById, insertInto } from "../../util/arrayUtils";
import update from "immutability-helper";
import Event from "../../models/Event";
import Workshop from "../../models/Workshop";
import { Link } from "react-router-dom";

export default class LanguageNewEventPage extends React.PureComponent {
  startEventInProps = () =>
    this.props.location.state && this.props.location.state.event;

  startEvent = () =>
    this.startEventInProps()
      ? this.props.location.state.event
      : {
          languages: [
            { id: this.props.language.id, name: this.props.language.name }
          ]
        };

  addEvent = event => {
    if (findById(event.languages, this.props.language.id)) {
      this.props.replaceLanguage(
        update(this.props.language, {
          events: {
            $set: insertInto(
              this.props.language.events,
              event,
              Event.revCompare
            )
          }
        })
      );
    }
  };

  replaceWorkshop = workshop => {
    this.props.replaceLanguage(Workshop.refresh(this.props.language, workshop));
  };

  render() {
    const t = this.props.t;

    return (
      <div>
        <h4>
          <Link to={this.props.basePath}>{`< ${
            this.props.language.name
          }`}</Link>
        </h4>
        <NewEventForm
          t={t}
          setNetworkError={this.props.setNetworkError}
          addEvent={this.addEvent}
          cancelForm={() => this.props.history.goBack()}
          startEvent={this.startEvent()}
          replaceWorkshop={this.replaceWorkshop}
        />
      </div>
    );
  }
}

LanguageNewEventPage.propTypes = {
  t: PropTypes.func.isRequired,
  location: PropTypes.object,
  history: PropTypes.object.isRequired,
  setNetworkError: PropTypes.func.isRequired,
  replaceLanguage: PropTypes.func.isRequired,
  language: PropTypes.object.isRequired,
  basePath: PropTypes.string.isRequired
};
