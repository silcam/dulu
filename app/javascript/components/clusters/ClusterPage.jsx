import React from "react";
import PropTypes from "prop-types";
import EditActionBar from "../shared/EditActionBar";
import deepcopy from "../../util/deepcopy";
import TextOrEditText from "../shared/TextOrEditText";
import update from "immutability-helper";
import DuluAxios from "../../util/DuluAxios";
// import styles from "./PersonPage.css";
import ClusterLanguagesTable from "./ClusterLanguagesTable";
import ParticipantsTable from "../languages/ParticipantsTable";
import Cluster from "../../models/Cluster";

export default class ClusterPage extends React.PureComponent {
  state = {
    cluster: deepcopy(this.props.cluster)
  };

  replaceCluster = cluster => {
    this.props.replaceCluster(cluster);
    this.setState({ cluster: deepcopy(cluster) });
  };

  updateCluster = mergeCluster => {
    this.setState(prevState => ({
      cluster: update(prevState.cluster, { $merge: mergeCluster })
    }));
  };

  save = async () => {
    this.setState({ saving: true });
    try {
      const data = await DuluAxios.put(
        `/api/clusters/${this.state.cluster.id}`,
        {
          cluster: Cluster.clusterParams(this.state.cluster)
        }
      );
      this.props.replaceCluster(data.cluster);
      this.setState({
        editing: false,
        cluster: deepcopy(data.cluster)
      });
    } catch (error) {
      this.props.setNetworkError(error);
    } finally {
      this.setState({ saving: false });
    }
  };

  invalid = () => {
    return this.state.cluster.name.length == 0;
  };

  render() {
    const cluster = this.state.cluster;
    const t = this.props.t;

    return (
      <div>
        <EditActionBar
          can={cluster.can}
          editing={this.state.editing}
          saveDisabled={this.invalid()}
          saveInProgress={this.state.saving}
          t={t}
          edit={() => this.setState({ editing: true })}
          save={this.save}
          cancel={() => {
            this.setState({
              editing: false,
              cluster: deepcopy(this.props.cluster)
            });
          }}
        />
        <h2>
          <TextOrEditText
            editing={this.state.editing}
            value={cluster.name}
            updateValue={value => this.updateCluster({ name: value })}
            t={t}
            validateNotBlank
          />
        </h2>
        <ClusterLanguagesTable
          cluster={cluster}
          t={t}
          editing={this.state.editing}
          updateCluster={this.updateCluster}
        />
        {!this.state.editing && (
          <ParticipantsTable
            t={t}
            participants={cluster.participants}
            cluster={cluster}
            replace={this.replaceCluster}
            setNetworkError={this.props.setNetworkError}
            can={cluster.can}
            basePath={this.props.basePath}
            history={this.props.history}
          />
        )}
      </div>
    );
  }
}

ClusterPage.propTypes = {
  setNetworkError: PropTypes.func.isRequired,
  replaceCluster: PropTypes.func.isRequired,
  cluster: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  basePath: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired
};
