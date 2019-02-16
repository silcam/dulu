import React from "react";
import EditActionBar from "../shared/EditActionBar";
import deepcopy from "../../util/deepcopy";
import TextOrEditText from "../shared/TextOrEditText";
import update from "immutability-helper";
import DuluAxios from "../../util/DuluAxios";
// import styles from "./PersonPage.css";
import ClusterLanguagesTable from "./ClusterLanguagesTable";
import ParticipantsContainer from "../languages/ParticipantsContainer";
import Cluster, { IClusterInflated, ICluster } from "../../models/Cluster";
import { T } from "../../i18n/i18n";
import { History } from "history";
import Loading from "../shared/Loading";
import { Deleter, Adder, IParticipant } from "../../models/TypeBucket";
import { Person } from "../../models/Person";
import { ILanguage } from "../../models/language";

interface IProps {
  id: number;
  cluster?: IClusterInflated;
  setCluster: (c: ICluster) => void;
  deleteCluster: Deleter;
  addPeople: Adder<Person>;
  addParticipants: Adder<IParticipant>;
  addLanguages: Adder<ILanguage>;
  t: T;
  basePath: string;
  history: History<any>;
}

interface IState {
  cluster?: IClusterInflated;
  saving?: boolean;
  editing?: boolean;
  loading: boolean;
}

export default class ClusterPage extends React.PureComponent<IProps, IState> {
  state: IState = {
    loading: true
  };

  async componentDidMount() {
    const data = await DuluAxios.get(`/api/clusters/${this.props.id}`);
    if (data) {
      this.props.addLanguages(data.languages);
      this.props.setCluster(data.cluster);
    }
    this.setState({ loading: false });
  }

  updateCluster = (mergeCluster: { [prop: string]: any }) => {
    this.setState(prevState => ({
      cluster: update(prevState.cluster, { $merge: mergeCluster })
    }));
  };

  edit = () =>
    this.setState({ editing: true, cluster: deepcopy(this.props.cluster) });

  save = async () => {
    this.setState({ saving: true });
    const data = await DuluAxios.put(`/api/clusters/${this.props.id}`, {
      cluster: Cluster.clusterParams(this.state.cluster as IClusterInflated)
    });
    if (data) {
      this.props.addLanguages(data.languages);
      this.props.setCluster(data.cluster);
      this.setState({
        editing: false,
        cluster: undefined
      });
    }
    this.setState({ saving: false });
  };

  delete = async () => {
    if (
      confirm(
        this.props.t("confirm_delete_cluster", {
          name: this.props.cluster!.name
        })
      )
    ) {
      const data = await DuluAxios.delete(`/api/clusters/${this.props.id}`);
      if (data) {
        this.props.deleteCluster(this.props.id);
        this.props.history.replace("/clusters");
      }
    }
  };

  invalid = () => {
    return this.state.cluster && this.state.cluster.name.length == 0;
  };

  render() {
    const cluster = this.state.editing
      ? (this.state.cluster as IClusterInflated)
      : this.props.cluster;
    const t = this.props.t;

    if (!cluster) return <Loading t={t} />;

    return (
      <div>
        {!this.state.loading && (
          <EditActionBar
            can={cluster.can}
            editing={this.state.editing}
            saveDisabled={this.invalid()}
            saving={this.state.saving}
            t={t}
            edit={this.edit}
            save={this.save}
            delete={this.delete}
            cancel={() => {
              this.setState({
                editing: false,
                cluster: deepcopy(this.props.cluster)
              });
            }}
          />
        )}
        <h2>
          <TextOrEditText
            editing={this.state.editing}
            value={cluster.name}
            updateValue={value => this.updateCluster({ name: value })}
            t={t}
            name="name"
            validateNotBlank
          />
        </h2>
        <ClusterLanguagesTable
          cluster={cluster}
          t={t}
          editing={this.state.editing}
          updateCluster={this.updateCluster}
          edit={this.edit}
        />
        {!this.state.editing && (
          <ParticipantsContainer
            t={t}
            cluster={cluster}
            can={cluster.can}
            basePath={this.props.basePath}
            history={this.props.history}
          />
        )}
      </div>
    );
  }
}
