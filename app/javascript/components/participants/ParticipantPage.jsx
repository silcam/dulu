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
    console.error(`Need to deprecate ParticipantPage!!!`);
    const data = await DuluAxios.get(`/api/participants/${this.props.id}`);
    if (data) {
      this.props.history.replace(routeTo(data.participant));
    } else {
      this.setState({ loading: false });
    }
  }

  render() {
    const t = this.props.t;
    return this.state.loading ? <Loading /> : null;
  }
}

function routeTo(participant) {
  return participant.cluster_id
    ? `/clusters/${participant.cluster_id}/participants/${participant.id}`
    : `/languages/${participant.language_id}/participants/${participant.id}`;
}

ParticipantPage.propTypes = {
  t: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,

  id: PropTypes.string.isRequired
};
