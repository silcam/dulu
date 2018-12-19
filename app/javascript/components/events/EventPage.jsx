import React from "react";
import PropTypes from "prop-types";
import DuluAxios from "../../util/DuluAxios";
import Loading from "../shared/Loading";
import EventView from "./EventView";

export default class EventPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  async componentDidMount() {
    try {
      const data = await DuluAxios.get(`/api/events/${this.props.id}`);
      this.setState({
        event: data.event,
        can: data.can,
        loading: false
      });
    } catch (error) {
      this.props.setNetworkError(error);
      this.setState({ loading: false });
    }
  }

  replaceEvent = newEvent => {
    this.setState({
      event: newEvent
    });
  };

  removeEvent = () => {
    this.props.history.goBack();
  };

  render() {
    const t = this.props.t;

    return this.state.loading ? (
      <Loading t={t} />
    ) : (
      <EventView
        t={t}
        setNetworkError={this.props.setNetworkError}
        event={this.state.event}
        can={this.state.can}
        replaceEvent={this.replaceEvent}
        removeEvent={this.removeEvent}
      />
    );
  }
}

EventPage.propTypes = {
  id: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  setNetworkError: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};
