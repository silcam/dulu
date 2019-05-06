import React from "react";
import PropTypes from "prop-types";
import deepcopy from "../../util/deepcopy";
import merge from "deepmerge";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import FormGroup from "../shared/FormGroup";
import TextInput from "../shared/TextInput";
import FuzzyDateInput from "../shared/FuzzyDateInput";

export default class MyOrganizationForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      organization_person: deepcopy(props.organization_person)
    };
  }

  updateOrganizationPerson = mergeOrganizationPerson => {
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
          <label>{this.props.organization.short_name}</label>
          <FormGroup label={t("Position")}>
            <TextInput
              setValue={position => this.updateOrganizationPerson({ position })}
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
              t={t}
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
              t={t}
              allowBlank
            />
          </FormGroup>
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

MyOrganizationForm.propTypes = {
  organization_person: PropTypes.object.isRequired,
  updateOrganizationPerson: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  cancelEdit: PropTypes.func.isRequired,
  organization: PropTypes.object.isRequired
};
