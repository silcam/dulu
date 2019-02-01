import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import Loading from "../shared/Loading";
import DuluAxios from "../../util/DuluAxios";

export default class ProgramsRedirect extends React.PureComponent {
  state = {};

  async componentDidMount() {
    const programId = parseInt(this.props.match.params.idOrAction);
    if (!programId) return;
    try {
      const data = await DuluAxios.get("/api/languages/find_language_id", {
        program_id: programId
      });
      this.setState({ language_id: data.language_id });
    } catch (error) {
      this.props.setNetworkError(error);
    }
  }

  render() {
    const idOrAction = this.props.match.params.idOrAction;

    if (!idOrAction) return <Redirect to="/languages" />;

    if (!parseInt(idOrAction))
      return <Redirect to={`/languages/${idOrAction}`} />;

    if (this.state.language_id)
      return <Redirect to={`/languages/${this.state.language_id}`} />;

    return <Loading t={this.props.t} />;
  }
}

ProgramsRedirect.propTypes = {
  t: PropTypes.func.isRequired,
  setNetworkError: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired
};
