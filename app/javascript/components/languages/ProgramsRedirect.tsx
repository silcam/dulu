import React from "react";
import { Redirect } from "react-router-dom";
import Loading from "../shared/Loading";
import DuluAxios from "../../util/DuluAxios";

interface IProps {
  match: {
    params: {
      idOrAction: string;
    };
  };
}

interface IState {
  language_id?: number;
}

export default class ProgramsRedirect extends React.PureComponent<
  IProps,
  IState
> {
  state: IState = {};

  async componentDidMount() {
    const programId = parseInt(this.props.match.params.idOrAction);
    if (!programId) return;
    const data = await DuluAxios.get("/api/languages/find_language_id", {
      program_id: programId
    });
    if (data) {
      this.setState({ language_id: data.language_id });
    }
  }

  render() {
    const idOrAction = this.props.match.params.idOrAction;

    if (!idOrAction) return <Redirect to="/languages" />;

    if (!parseInt(idOrAction))
      return <Redirect to={`/languages/${idOrAction}`} />;

    if (this.state.language_id)
      return <Redirect to={`/languages/${this.state.language_id}`} />;

    return <Loading />;
  }
}
