import React from "react";
import PropTypes from "prop-types";
import { findById, replace, deleteFrom } from "../../util/arrayUtils";
import EventView from "../events/EventView";
import update from "immutability-helper";
import { Link } from "react-router-dom";
import Workshop from "../../models/Workshop";
import Loading from "../shared/Loading";
import DuluAxios from "../../util/DuluAxios";

export default class LanguageEventPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    if (!this.event()) {
      this.setState({ loading: true });
      try {
        const data = await DuluAxios.get(
          `/api/languages/${this.props.language.id}/get_event`,
          {
            event_id: this.props.eventId
          }
        );
        this.props.replaceLanguage(
          update(this.props.language, {
            events: { $set: data.events }
          })
        );
      } catch (error) {
        this.props.setNetworkError(error);
      } finally {
        this.setState({ loading: false });
      }
    }
  }

  event = () => findById(this.props.language.events, this.props.eventId);

  replaceEvent = newEvent => {
    this.props.replaceLanguage(
      update(this.props.language, {
        events: { $set: replace(this.props.language.events, newEvent) }
      })
    );
  };

  replaceWorkshop = workshop => {
    this.props.replaceLanguage(Workshop.refresh(this.props.language, workshop));
  };

  removeEvent = () => {
    this.props.replaceLanguage(
      update(this.props.language, {
        events: { $set: deleteFrom(this.props.language.events, event.id) }
      })
    );
    this.props.history.goBack();
  };

  render() {
    const t = this.props.t;
    const language = this.props.language;
    const event = this.event();

    return (
      <div>
        <h4>
          <Link to={this.props.basePath}>{`< ${language.name}`}</Link>
        </h4>
        {this.state.loading && <Loading t={t} />}
        {event && (
          <EventView
            event={event}
            t={t}
            setNetworkError={this.props.setNetworkError}
            can={event.can}
            replaceEvent={this.replaceEvent}
            removeEvent={this.removeEvent}
            replaceWorkshop={this.replaceWorkshop}
          />
        )}
      </div>
    );
  }
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
