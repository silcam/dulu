import React from "react";
import PropTypes from "prop-types";
import {
  TextAreaGroup,
  TextInputGroup,
  ValidatedTextInputGroup
} from "../shared/formGroup";
import SaveButton from "../shared/SaveButton";
import CancelButton from "../shared/CancelButton";
import DuluAxios from "../../util/DuluAxios";

export default class NewOrganizationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      organization: {
        short_name: "",
        long_name: "",
        description: ""
      },
      saving: false,
      failedSave: false
    };
  }

  handleInput = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevState => {
      let organization = prevState.organization;
      organization[name] = value;
      return { organization: organization };
    });
  };

  handleKeyDown = e => {
    if (e.key == "Enter") {
      this.clickSave();
    }
  };

  inputValid = () => {
    return this.state.organization.short_name.length > 0;
  };

  clickSave = async () => {
    this.setState({ saving: true });
    const data = await DuluAxios.post("/api/organizations", {
      organization: this.state.organization
    });
    if (data) {
      this.props.addOrganization(data.organization);
      this.props.history.push(`/organizations/${data.organization.id}`);
    }
  };

  render() {
    const t = this.props.t;
    const organization = this.state.organization;

    return (
      <div>
        <div onKeyDown={this.handleKeyDown}>
          <h3>{t("New_organization")}</h3>

          <ValidatedTextInputGroup
            handleInput={this.handleInput}
            name="short_name"
            label={t("Short_name")}
            value={organization.short_name}
            t={t}
            validateNotBlank
            showError={this.state.failedSave}
            autoFocus
          />

          <TextInputGroup
            handleInput={this.handleInput}
            name="long_name"
            label={t("Long_name")}
            value={organization.long_name}
          />
        </div>

        <TextAreaGroup
          handleInput={this.handleInput}
          name="description"
          label={t("Description")}
          value={organization.description}
        />

        <p>
          <SaveButton
            handleClick={this.clickSave}
            saveInProgress={this.state.saving}
            t={t}
            disabled={!this.inputValid()}
          />

          <CancelButton t={t} />
        </p>
      </div>
    );
  }
}

NewOrganizationForm.propTypes = {
  addOrganization: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,

  t: PropTypes.func.isRequired
};
