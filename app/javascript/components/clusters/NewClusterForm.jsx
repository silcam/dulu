import React from "react";
import PropTypes from "prop-types";
import { TextInputGroup } from "../shared/formGroup";
import SaveButton from "../shared/SaveButton";
import CancelButton from "../shared/CancelButton";
import update from "immutability-helper";

export default class NewClusterForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cluster: { name: "" }
    };
  }

  updateCluster = mergeCluster => {
    this.setState(prevState => ({
      cluster: update(prevState.cluster, { $merge: mergeCluster })
    }));
  };

  render() {
    const t = this.props.t;

    return (
      <div>
        <h2>{t("New_cluster")}</h2>
        <TextInputGroup
          value={this.state.cluster.name}
          handleInput={e => this.updateCluster({ name: e.target.value })}
          placeholder={t("Name")}
          autoFocus
        />
        <SaveButton
          handleClick={() => this.props.addCluster(this.state.cluster)}
          t={t}
          saveInProgress={this.props.saving}
          disabled={this.state.cluster.name.length == 0}
        />
        <CancelButton t={t} />
      </div>
    );
  }
}

NewClusterForm.propTypes = {
  t: PropTypes.func.isRequired,
  addCluster: PropTypes.func.isRequired,
  saving: PropTypes.bool
};
