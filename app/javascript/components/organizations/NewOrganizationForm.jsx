import React from "react";
import {
  TextAreaGroup,
  TextInputGroup,
  ValidatedTextInputGroup
} from "../shared/formGroup";
import SaveButton from "../shared/SaveButton";
import CancelButton from "../shared/CancelButton";

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

  clickSave = () => {
    if (!this.inputValid()) {
      this.setState({ failedSave: true });
    } else {
      this.setState({ saving: true });
      this.props.addOrganization(this.state.organization);
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
          />

          <CancelButton t={t} />
        </p>
      </div>
    );
  }
}
