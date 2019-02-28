import React from "react";
import { TextInputGroup } from "../shared/formGroup";
import SaveButton from "../shared/SaveButton";
import CancelButton from "../shared/CancelButton";
import update from "immutability-helper";
import { T } from "../../i18n/i18n";
import { ICluster } from "../../models/Cluster";
import { AnyObj, JSEvent } from "../../models/TypeBucket";
import DuluAxios from "../../util/DuluAxios";
import { History } from "history";

interface IProps {
  t: T;
  setCluster: (c: ICluster) => void;
  history: History;
}

interface IState {
  cluster: { name: string };
  saving?: boolean;
}

export default class NewClusterForm extends React.PureComponent<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      cluster: { name: "" }
    };
  }

  updateCluster = (mergeCluster: AnyObj) => {
    this.setState(prevState => ({
      cluster: update(prevState.cluster, { $merge: mergeCluster })
    }));
  };

  save = async () => {
    this.setState({ saving: true });
    const data = await DuluAxios.post("/api/clusters", {
      cluster: this.state.cluster
    });
    if (data) {
      this.props.setCluster(data.cluster);
      this.props.history.push(`/clusters/${data.cluster.id}`);
    } else {
      this.setState({ saving: false });
    }
  };

  render() {
    const t = this.props.t;
    return (
      <div>
        <h2>{t("New_cluster")}</h2>
        <TextInputGroup
          value={this.state.cluster.name}
          handleInput={(e: JSEvent) =>
            this.updateCluster({ name: e.target.value })
          }
          placeholder={t("Name")}
          name="name"
          autoFocus
        />
        <SaveButton
          handleClick={this.save}
          t={t}
          saveInProgress={this.state.saving}
          disabled={this.state.cluster.name.length == 0}
        />
        <CancelButton />
      </div>
    );
  }
}
