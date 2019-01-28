import React from "react";
import PropTypes from "prop-types";
import DuluAxios from "../../util/DuluAxios";
import Loading from "../shared/Loading";

export default class ParticipantPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  async componentDidMount() {
    try {
      const data = await DuluAxios.get(`/api/participants/${this.props.id}`);
      this.props.history.replace(routeTo(data.participant));
    } catch (error) {
      this.props.setNetworkError(error);
      this.setState({ loading: false });
    }
  }

  render() {
    const t = this.props.t;
    return this.state.loading ? <Loading t={t} /> : null;
  }
}

function routeTo(participant) {
  return participant.cluster
    ? `/clusters/${participant.cluster.id}/participants/${participant.id}`
    : `/languages/${participant.language.id}/participants/${participant.id}`;
}

ParticipantPage.propTypes = {
  t: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  setNetworkError: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};
