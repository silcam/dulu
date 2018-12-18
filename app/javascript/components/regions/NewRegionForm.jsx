import React from "react";
import PropTypes from "prop-types";
import update from "immutability-helper";
import { TextInputGroup } from "../shared/formGroup";
import SaveButton from "../shared/SaveButton";
import CancelButton from "../shared/CancelButton";

export default class NewRegionForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      region: { name: "" }
    };
  }

  updateRegion = mergeRegion => {
    this.setState(prevState => ({
      region: update(prevState.region, { $merge: mergeRegion })
    }));
  };

  render() {
    const t = this.props.t;

    return (
      <div>
        <h2>{t("New_region")}</h2>
        <TextInputGroup
          value={this.state.region.name}
          handleInput={e => this.updateRegion({ name: e.target.value })}
          placeholder={t("Name")}
          autoFocus
        />
        <SaveButton
          handleClick={() => this.props.addRegion(this.state.region)}
          t={t}
          saveInProgress={this.props.saving}
          disabled={this.state.region.name.length == 0}
        />
        <CancelButton t={t} />
      </div>
    );
  }
}

NewRegionForm.propTypes = {
  t: PropTypes.func.isRequired,
  addRegion: PropTypes.func.isRequired,
  saving: PropTypes.bool
};
