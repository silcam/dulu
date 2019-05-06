import React from "react";
import PropTypes from "prop-types";
import selectOptionsFromObject from "../../util/selectOptionsFromObject";
import update from "immutability-helper";
import EditEventParticipantsTable from "./EditEventParticipantsTable";
import SaveButton from "../shared/SaveButton";
import DuluAxios from "../../util/DuluAxios";
import Event from "../../models/Event";
import FormGroup from "../shared/FormGroup";
import ValidatedTextInput from "../shared/ValidatedTextInput";
import SelectInput from "../shared/SelectInput";
import FuzzyDateInput from "../shared/FuzzyDateInput";
import TextArea from "../shared/TextArea";

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
    const data = await DuluAxios.post("/api/events", {
      event: Event.prepareEventParams(Event.ensureEndDate(this.state.event))
    });
    if (data) {
      this.props.addLanguages(data.languages);
      this.props.addClusters(data.clusters);
      this.props.addPeople(data.people);
      this.props.addActivities(data.workshops_activities);
      this.props.setEvent(data.event);
      this.props.cancelForm();
    } else {
      this.setState({ saveInProgress: false });
    }
  };

  render() {
    const event = this.state.event;
    const t = this.props.t;
    return (
      <div id="NewEventForm">
        <h3>{t("New_event")}</h3>
        <FormGroup>
          <ValidatedTextInput
            value={event.name}
            name="Name"
            setValue={name => this.updateEvent({ name })}
            placeholder={t("Name")}
            validateNotBlank
            t={t}
            autoFocus
          />
        </FormGroup>
        <FormGroup label={t("Domain")}>
          <SelectInput
            value={event.domain}
            options={selectOptionsFromObject(t("domains"))}
            setValue={domain => this.updateEvent({ domain })}
          />
        </FormGroup>
        <FormGroup label={t("Start_date")}>
          <FuzzyDateInput
            date={event.start_date}
            handleDateInput={date => this.updateEvent({ start_date: date })}
            dateIsInvalid={() => this.updateEvent({ start_date: "" })}
            t={t}
          />
        </FormGroup>

        <FormGroup label={t("End_date")}>
          <FuzzyDateInput
            date={event.end_date}
            handleDateInput={date => this.updateEvent({ end_date: date })}
            dateIsInvalid={() => this.updateEvent({ end_date: "" })}
            t={t}
          />
        </FormGroup>

        <FormGroup label={t("Note")}>
          <TextArea
            value={event.note}
            setValue={note => this.updateEvent({ note })}
          />
        </FormGroup>

        <EditEventParticipantsTable
          event={event}
          t={t}
          replaceEvent={event => this.setState({ event: event })}
        />

        <SaveButton
          onClick={this.save}
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
  cancelForm: PropTypes.func.isRequired,
  startEvent: PropTypes.object,
  setEvent: PropTypes.func.isRequired,
  addLanguages: PropTypes.func.isRequired,
  addPeople: PropTypes.func.isRequired,
  addClusters: PropTypes.func.isRequired,
  addActivities: PropTypes.func.isRequired
};
