import React from "react";
import { TextInputGroup, FuzzyDateGroup } from "../shared/formGroup";
import deepcopy from "../../util/deepcopy";
import merge from "deepmerge";

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
  };

  save = () => {
    this.props.updateOrganizationPerson(this.state.organization_person);
  };

  render() {
    const t = this.props.t;
    const org_person = this.state.organization_person;
    return (
      <tr>
        <td>
          <label>{org_person.organization.name}</label>
          <TextInputGroup
            label={t("Position")}
            handleInput={e =>
              this.updateOrganizationPerson({ position: e.target.value })
            }
            value={org_person.position}
          />
          {/* <FuzzyDateGroup
            label={t("Start_date")}
            date={org_person.start_date}
            handleDateInput={this.setStartDate}
            dateIsInvalid={this.setInvalid}
            strings={t("date_strings")}
          />
          <FuzzyDateGroup
            label={t("End_date")}
            date={org_person.end_date}
            handleDateInput={this.setEndDate}
            dateIsInvalid={this.setInvalid}
            strings={t("date_strings")}
            allowBlank
          /> */}
          <div>
            <button
              onClick={this.save}
              disabled={this.state.invalid && "disabled"}
              style={{ fontSize: "11px" }}
            >
              {t("Save")}
            </button>
            <button
              className="btnRed"
              onClick={this.props.cancelEdit}
              style={{ fontSize: "11px" }}
            >
              {t("Cancel")}
            </button>
          </div>
        </td>
      </tr>
    );
  }
}
