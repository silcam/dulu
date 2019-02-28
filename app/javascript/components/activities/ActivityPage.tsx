import React from "react";
import DuluAxios from "../../util/DuluAxios";
import Loading from "../shared/Loading";
import { History } from "history";

interface IProps {
  history: History<any>;
  id: string;
}

interface IState {
  loading?: boolean;
}

export default class ActivityPage extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      loading: true
    };
  }

  async componentDidMount() {
    const data = await DuluAxios.get(`/api/activities/${this.props.id}`);
    if (data) {
      this.props.history.replace(
        `/languages/${data.activity.language_id}/activities/${data.activity.id}`
      );
    }
  }

  render() {
    return this.state.loading ? <Loading /> : null;
  }
}
