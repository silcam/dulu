import React from "react";
import PropTypes from "prop-types";
import {
  SelectGroup,
  FuzzyDateGroup,
  ValidatedTextInputGroup,
  TextAreaGroup
} from "../shared/formGroup";
import selectOptionsFromObject from "../../util/selectOptionsFromObject";
import update from "immutability-helper";
import EditEventParticipantsTable from "./EditEventParticipantsTable";
import SaveButton from "../shared/SaveButton";
import DuluAxios from "../../util/DuluAxios";
import Event from "../../models/Event";

export default class NewEventForm extends React.PureComponent {
  constructor(props) {
    super(props);
    let event = {
      domain: Object.keys(props.t("domains"))[0],
      name: "",
      start_date: "",
      end_date: "",
      note: "",
      clusters: [],
      languages: [],
      event_participants: []
    };
    if (props.startEvent) Object.assign(event, props.startEvent);
    this.state = {
      event: event
    };
  }

  updateEvent = mergeEvent => {
    this.setState(prevState => ({
      event: update(prevState.event, { $merge: mergeEvent })
    }));
  };

  eventInvalid = () => {
    const event = this.state.event;
    return !event.name || !event.start_date;
  };

  save = async () => {
    this.setState({ saveInProgress: true });
    try {
      const data = await DuluAxios.post("/api/events", {
        event: Event.prepareEventParams(Event.ensureEndDate(this.state.event))
      });
      this.props.addLanguages(data.languages);
      this.props.addClusters(data.clusters);
      this.props.addPeople(data.people);
      this.props.addActivities(data.workshops_activities);
      this.props.setEvent(data.event);
      this.props.cancelForm();
    } catch (error) {
      this.props.setNetworkError(error);
      this.setState({ saveInProgress: false });
    }
  };

  render() {
    const event = this.state.event;
    const t = this.props.t;
    return (
      <div id="NewEventForm">
        <h3>{t("New_event")}</h3>
        <ValidatedTextInputGroup
          value={event.name}
          name="Name"
          handleInput={e => this.updateEvent({ name: e.target.value })}
          placeholder={t("Name")}
          validateNotBlank
          t={t}
          autoFocus
        />
        <SelectGroup
          label={t("Domain")}
          value={event.domain}
          options={selectOptionsFromObject(t("domains"))}
          handleChange={e => this.updateEvent({ domain: e.target.value })}
        />
        <FuzzyDateGroup
          label={t("Start_date")}
          date={event.start_date}
          handleDateInput={date => this.updateEvent({ start_date: date })}
          dateIsInvalid={() => this.updateEvent({ start_date: "" })}
          t={t}
        />

        <FuzzyDateGroup
          label={t("End_date")}
          date={event.end_date}
          handleDateInput={date => this.updateEvent({ end_date: date })}
          dateIsInvalid={() => this.updateEvent({ end_date: "" })}
          t={t}
        />

        <TextAreaGroup
          label={t("Note")}
          value={event.note}
          handleInput={e => this.updateEvent({ note: e.target.value })}
        />

        <EditEventParticipantsTable
          event={event}
          t={t}
          replaceEvent={event => this.setState({ event: event })}
        />

        <SaveButton
          t={t}
          handleClick={this.save}
          disabled={this.eventInvalid()}
          saveInProgress={this.state.saveInProgress}
        />

        <button onClick={this.props.cancelForm} className="btnRed">
          {t("Cancel")}
        </button>
      </div>
    );
  }
}

NewEventForm.propTypes = {
  t: PropTypes.func.isRequired,
  setNetworkError: PropTypes.func.isRequired,
  cancelForm: PropTypes.func.isRequired,
  startEvent: PropTypes.object,
  setEvent: PropTypes.func.isRequired,
  addLanguages: PropTypes.func.isRequired,
  addPeople: PropTypes.func.isRequired,
  addClusters: PropTypes.func.isRequired,
  addActivities: PropTypes.func.isRequired
};
