import React from "react";
import { TextInputGroup, FuzzyDateGroup } from "../shared/formGroup";
import deepcopy from "../../util/deepcopy";
import merge from "deepmerge";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";

export default class MyOrganizationForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      organization_person: deepcopy(props.organization_person)
    };
  }

  updateOrganizationPerson = mergeOrganizationPerson => {
    console.log(mergeOrganizationPerson);
    this.setState(prevState => ({
      organization_person: merge(
        prevState.organization_person,
        mergeOrganizationPerson
      )
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
    const t = this.props.t;
    const org_person = this.state.organization_person;
    return (
      <tr>
        <td colSpan="4">
          <label>{org_person.organization.name}</label>
          <TextInputGroup
            label={t("Position")}
            handleInput={e =>
              this.updateOrganizationPerson({ position: e.target.value })
            }
            value={org_person.position}
          />
          <FuzzyDateGroup
            label={t("Start_date")}
            date={org_person.start_date}
            handleDateInput={date =>
              this.updateOrganizationPerson({ start_date: date })
            }
            dateIsInvalid={() => {
              this.setState({ invalidStartDate: true });
            }}
            t={t}
            allowBlank
          />
          <FuzzyDateGroup
            label={t("End_date")}
            date={org_person.end_date}
            handleDateInput={date =>
              this.updateOrganizationPerson({ end_date: date })
            }
            dateIsInvalid={() => {
              this.setState({ invalidEndDate: true });
            }}
            t={t}
            allowBlank
          />
          <div>
            <SmallSaveAndCancel
              handleSave={this.save}
              handleCancel={this.props.cancelEdit}
              t={t}
              saveDisabled={this.invalid()}
            />
          </div>
        </td>
      </tr>
    );
  }
}
