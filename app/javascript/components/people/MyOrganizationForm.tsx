import React from "react";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import FormGroup from "../shared/FormGroup";
import TextInput from "../shared/TextInput";
import FuzzyDateInput from "../shared/FuzzyDateInput";
import { IOrganizationPerson, IOrganization } from "../../models/Organization";
import I18nContext from "../../contexts/I18nContext";
import update from "immutability-helper";

interface IProps {
  organization_person: IOrganizationPerson;
  updateOrganizationPerson: (op: IOrganizationPerson) => void;
  cancelEdit: () => void;
  organization: IOrganization;
}

interface IState {
  organization_person: IOrganizationPerson;
  invalidStartDate?: boolean;
  invalidEndDate?: boolean;
}

export default class MyOrganizationForm extends React.PureComponent<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      organization_person: { ...props.organization_person }
    };
  }

  updateOrganizationPerson = (
    mergeOrganizationPerson: Partial<IOrganizationPerson>
  ) => {
    this.setState(prevState => ({
      organization_person: update(prevState.organization_person, {
        $merge: mergeOrganizationPerson
      })
    }));
    if (mergeOrganizationPerson.start_date)
      this.setState({ invalidStartDate: undefined });
    if (mergeOrganizationPerson.end_date)
      this.setState({ invalidEndDate: undefined });
  };

  invalid = () => this.state.invalidStartDate || this.state.invalidEndDate;

  save = () => {
    this.props.updateOrganizationPerson(this.state.organization_person);
  };

  render() {
    const org_person = this.state.organization_person;
    return (
      <I18nContext.Consumer>
        {t => (
          <tr>
            <td colSpan={4}>
              <label>{this.props.organization.short_name}</label>
              <FormGroup label={t("Position")}>
                <TextInput
                  setValue={position =>
                    this.updateOrganizationPerson({ position })
                  }
                  value={org_person.position || ""}
                />
              </FormGroup>
              <FormGroup label={t("Start_date")}>
                <FuzzyDateInput
                  date={org_person.start_date}
                  handleDateInput={date =>
                    this.updateOrganizationPerson({ start_date: date })
                  }
                  dateIsInvalid={() => {
                    this.setState({ invalidStartDate: true });
                  }}
                  allowBlank
                />
              </FormGroup>
              <FormGroup label={t("End_date")}>
                <FuzzyDateInput
                  date={org_person.end_date}
                  handleDateInput={date =>
                    this.updateOrganizationPerson({ end_date: date })
                  }
                  dateIsInvalid={() => {
                    this.setState({ invalidEndDate: true });
                  }}
                  allowBlank
                />
              </FormGroup>
              <div>
                <SmallSaveAndCancel
                  handleSave={this.save}
                  handleCancel={this.props.cancelEdit}
                  saveDisabled={this.invalid()}
                />
              </div>
            </td>
          </tr>
        )}
      </I18nContext.Consumer>
    );
  }
}
