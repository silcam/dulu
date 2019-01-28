import React from "react";
import PropTypes from "prop-types";
import DuluAxios from "../../util/DuluAxios";
import Loading from "../shared/Loading";

export default class ActivityPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  async componentDidMount() {
    try {
      const data = await DuluAxios.get(`/api/activities/${this.props.id}`);
      this.props.history.replace(
        `/languages/${data.activity.language.id}/activities/${data.activity.id}`
      );
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

ActivityPage.propTypes = {
  t: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  setNetworkError: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};
