import React from "react";
import SaveButton from "../shared/SaveButton";
import CancelButton from "../shared/CancelButton";
import DuluAxios from "../../util/DuluAxios";
import update from "immutability-helper";
import ValidatedTextInput from "../shared/ValidatedTextInput";
import FormGroup from "../shared/FormGroup";
import TextInput from "../shared/TextInput";
import TextArea from "../shared/TextArea";
import { History } from "history";
import { Setter } from "../../models/TypeBucket";
import { IOrganization } from "../../models/Organization";
import I18nContext from "../../contexts/I18nContext";

interface IProps {
  addOrganization: Setter<IOrganization>;
  history: History;
}

interface IState {
  organization: { short_name: string; long_name: string; description: string };
  saving?: boolean;
  failedSave?: boolean;
}

export default class NewOrganizationForm extends React.Component<
  IProps,
  IState
> {
  constructor(props: IProps) {
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

  handleInput = (e: { target: { name: string; value: string } }) => {
    const name = e.target.name;
    const value = e.target.value;
    this.updateOrganization({ [name]: value });
  };

  updateOrganization = (mergeOrg: Partial<IOrganization>) => {
    this.setState(prevState => ({
      organization: update(prevState.organization, { $merge: mergeOrg })
    }));
  };

  handleKeyDown = (e: { key: string }) => {
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
    const organization = this.state.organization;

    return (
      <I18nContext.Consumer>
        {t => (
          <div>
            <div onKeyDown={this.handleKeyDown}>
              <h3>{t("New_organization")}</h3>

              <FormGroup label={t("Short_name")}>
                <ValidatedTextInput
                  setValue={short_name =>
                    this.updateOrganization({ short_name })
                  }
                  name="short_name"
                  value={organization.short_name}
                  validateNotBlank
                  showError={this.state.failedSave}
                  autoFocus
                />
              </FormGroup>

              <FormGroup label={t("Long_name")}>
                <TextInput
                  setValue={long_name => this.updateOrganization({ long_name })}
                  name="long_name"
                  value={organization.long_name}
                />
              </FormGroup>
            </div>

            <FormGroup label={t("Description")}>
              <TextArea
                setValue={description =>
                  this.updateOrganization({ description })
                }
                name="description"
                value={organization.description}
              />
            </FormGroup>

            <p>
              <SaveButton
                onClick={this.clickSave}
                saveInProgress={this.state.saving}
                disabled={!this.inputValid()}
              />

              <CancelButton />
            </p>
          </div>
        )}
      </I18nContext.Consumer>
    );
  }
}
