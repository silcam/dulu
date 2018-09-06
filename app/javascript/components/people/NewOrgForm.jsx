import axios from "axios";
import React from "react";

import CloseIconButton from "../shared/CloseIconButton";
import {
  TextAreaGroup,
  TextInputGroup,
  ValidatedTextInputGroup
} from "../shared/formGroup";
import SaveButton from "../shared/SaveButton";

class NewOrgForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      org: {
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
      let org = prevState.org;
      org[name] = value;
      return { org: org };
    });
  };

  handleKeyDown = e => {
    if (e.key == "Enter") {
      this.clickSave();
    }
  };

  inputValid = () => {
    return this.state.org.short_name.length > 0;
  };

  clickSave = () => {
    if (!this.inputValid()) {
      this.setState({ failedSave: true });
    } else {
      this.setState({ saving: true });
      axios
        .post("/api/organizations", {
          authenticity_token: this.props.authToken,
          organization: this.state.org
        })
        .then(response => {
          this.props.addOrg(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  clickClose = () => {
    this.props.setSelection(null);
  };

  render() {
    const t = this.props.t;
    const org = this.state.org;

    return (
      <div>
        <div onKeyDown={this.handleKeyDown}>
          <h3 style={{ color: "#aaa" }}>
            <CloseIconButton handleClick={this.clickClose} />
          </h3>

          <h3>{t("New_organization")}</h3>

          <ValidatedTextInputGroup
            handleInput={this.handleInput}
            name="short_name"
            label={t("Short_name")}
            value={org.short_name}
            t={t}
            validateNotBlank
            showError={this.state.failedSave}
            autoFocus
          />

          <TextInputGroup
            handleInput={this.handleInput}
            name="long_name"
            label={t("Long_name")}
            value={org.long_name}
          />
        </div>

        <TextAreaGroup
          handleInput={this.handleInput}
          name="description"
          label={t("Description")}
          value={org.description}
        />

        <p>
          <SaveButton
            handleClick={this.clickSave}
            saveInProgress={this.state.saving}
            t={t}
          />
        </p>
      </div>
    );
  }
}

export default NewOrgForm;
