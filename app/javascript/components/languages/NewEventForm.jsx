import React from "react";
import PropTypes from "prop-types";
import {
  TextInputGroup,
  SelectGroup,
  FuzzyDateGroup
} from "../shared/formGroup";
import selectOptionsFromObject from "../../util/selectOptionsFromObject";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import update from "immutability-helper";
import DuluAxios from "../../util/DuluAxios";

export default class NewEventForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      newEvent: {
        name: "",
        start_date: "",
        end_date: "",
        domain: props.defaultDomain || Object.keys(props.t("domains"))[0],
        program_ids: props.programId && [props.programId]
      }
    };
  }

  updateNewEvent = mergeEvent => {
    this.setState(prevState => ({
      newEvent: update(prevState.newEvent, { $merge: mergeEvent })
    }));
  };

  newEventInvalid = () => {
    return (
      !this.state.newEvent.name ||
      this.state.newEvent.startDateInvalid ||
      this.state.newEvent.endDateInvalid
    );
  };

  save = async () => {
    this.setState({ saving: true });
    try {
      const data = await DuluAxios.post(`/api/events`, {
        event: this.state.newEvent
      });
      this.props.addNewEvent(data.event);
    } catch (error) {
      this.props.setNetworkError(error);
      this.setState({ saving: false });
    }
  };

  render() {
    const t = this.props.t;
    return (
      <div>
        <TextInputGroup
          label={t("New_event")}
          placeholder={t("Name")}
          value={this.state.newEvent.name}
          handleInput={e => this.updateNewEvent({ name: e.target.value })}
          autoFocus
        />
        <SelectGroup
          label={t("Domain")}
          value={this.state.newEvent.domain}
          handleChange={e => this.updateNewEvent({ domain: e.target.value })}
          options={selectOptionsFromObject(t("domains"))}
        />
        <FuzzyDateGroup
          label={t("Start_date")}
          date={this.state.newEvent.start_date}
          handleDateInput={date =>
            this.updateNewEvent({
              start_date: date,
              startDateInvalid: undefined
            })
          }
          t={t}
          dateIsInvalid={() => this.updateNewEvent({ startDateInvalid: true })}
        />
        <FuzzyDateGroup
          label={t("End_date")}
          date={this.state.newEvent.end_date}
          handleDateInput={date =>
            this.updateNewEvent({ end_date: date, endDateInvalid: undefined })
          }
          t={t}
          dateIsInvalid={() => this.updateNewEvent({ endDateInvalid: true })}
        />
        <SmallSaveAndCancel
          t={t}
          handleSave={this.save}
          handleCancel={this.props.cancelForm}
          saveInProgress={this.state.saving}
          saveDisabled={this.newEventInvalid()}
        />
      </div>
    );
  }
}

NewEventForm.propTypes = {
  t: PropTypes.func.isRequired,
  cancelForm: PropTypes.func.isRequired,
  addNewEvent: PropTypes.func.isRequired,
  defaultDomain: PropTypes.string,
  setNetworkError: PropTypes.func.isRequired,
  programId: PropTypes.number
};
