import React from "react";
import PropTypes from "prop-types";
import DuluAxios from "../../util/DuluAxios";
import Loading from "../shared/Loading";
import EditActionBar from "../shared/EditActionBar";
import eventDateString from "../../util/eventDateString";
import EventsParticipantsTable from "./EventsParticipantsTable";
import TextOrEditText from "../shared/TextOrEditText";
import deepcopy from "../../util/deepcopy";
import update from "immutability-helper";
import TextOrTextArea from "../shared/TextOrTextArea";
import style from "./EventPage.css";
import P from "../shared/P";
import { FuzzyDateGroup, SelectGroup } from "../shared/formGroup";
import selectOptionsFromObject from "../../util/selectOptionsFromObject";
import EditEventParticipantsTable from "./EditEventParticipantsTable";
import Event from "../../models/Event";

export default class EventView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  async componentDidMount() {
    try {
      const data = await DuluAxios.get(`/api/events/${this.props.id}`);
      this.addEventFromData(data);
      this.setState({ loading: false });
    } catch (error) {
      this.props.setNetworkError(error);
    }
  }

  addEventFromData = data => {
    this.props.addLanguages(data.languages);
    this.props.addClusters(data.clusters);
    this.props.addPeople(data.people);
    this.props.addActivities(data.workshops_activities);
    this.props.setEvent(data.event);
  };

  updateEvent = mergeEvent => {
    this.setState(prevState => ({
      event: update(prevState.event, { $merge: mergeEvent })
    }));
  };

  edit = () => {
    const event = deepcopy(this.props.event);
    event.languages = [...this.props.eventLanguages];
    event.clusters = [...this.props.eventClusters];
    event.event_participants = [...this.props.eventParticipants];
    this.setState({
      event: event,
      editing: true
    });
  };

  cancelEdit = () => {
    this.setState({
      event: undefined,
      editing: false
    });
  };

  eventIsInvalid = () => {
    return !this.state.event.name;
  };

  save = async () => {
    this.setState({ saving: true });
    const event = Event.prepareEventParams(
      this.state.event,
      this.state.eventBackup
    );
    try {
      const data = await DuluAxios.put(`/api/events/${this.props.event.id}`, {
        event: event
      });
      this.addEventFromData(data);
      this.setState({
        event: undefined,
        editing: false,
        saving: false
      });
    } catch (error) {
      this.props.setNetworkError(error);
      this.setState({ saving: false });
    }
  };

  delete = async () => {
    if (
      confirm(
        this.props.t("confirm_delete_event", { name: this.props.event.name })
      )
    ) {
      try {
        const event = this.props.event;
        await DuluAxios.delete(`/api/events/${this.props.id}`);
        this.props.history.goBack();
        this.props.deleteEvent(this.props.id);
        if (event.workshop_id)
          this.props.deleteWorkshopEvent(
            event.workshop_activity_id,
            event.workshop_id
          );
      } catch (error) {
        this.props.setNetworkError(error);
      }
    }
  };

  render() {
    const t = this.props.t;
    const event = this.state.editing ? this.state.event : this.props.event;
    if (!event) return <Loading t={t} />;
    return (
      <div className={style.eventPage}>
        <div>
          {!this.state.loading && (
            <EditActionBar
              can={event.can}
              editing={this.state.editing}
              saving={this.state.saving}
              save={this.save}
              saveDisabled={this.state.editing && this.eventIsInvalid()}
              cancel={this.cancelEdit}
              edit={this.edit}
              delete={this.delete}
              t={t}
            />
          )}
          <h2>
            <TextOrEditText
              name="name"
              editing={this.state.editing}
              value={event.name}
              updateValue={value => this.updateEvent({ name: value })}
              t={t}
              validateNotBlank
            />
          </h2>
          {this.state.editing ? (
            <div>
              <SelectGroup
                label={t("Domain")}
                value={event.domain}
                handleChange={e => this.updateEvent({ domain: e.target.value })}
                options={selectOptionsFromObject(t("domains"))}
              />
              <FuzzyDateGroup
                label={t("Start_date")}
                date={event.start_date}
                handleDateInput={date => this.updateEvent({ start_date: date })}
                t={t}
              />
              <FuzzyDateGroup
                label={t("End_date")}
                date={event.end_date}
                handleDateInput={date => this.updateEvent({ end_date: date })}
                t={t}
              />
            </div>
          ) : (
            <h4>
              {eventDateString(
                event.start_date,
                event.end_date,
                t("month_names_short")
              )}
            </h4>
          )}
          <P>
            <TextOrTextArea
              label={t("Note")}
              editing={this.state.editing}
              value={event.note}
              updateValue={value => this.updateEvent({ note: value })}
            />
          </P>
          <div className={style.participantsTable}>
            {this.state.editing ? (
              <EditEventParticipantsTable
                event={event}
                t={t}
                replaceEvent={event => this.setState({ event: event })}
              />
            ) : (
              <EventsParticipantsTable
                event={event}
                eventLanguages={this.props.eventLanguages}
                eventClusters={this.props.eventClusters}
                eventParticipants={this.props.eventParticipants}
                t={t}
                can={this.state.can}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

EventView.propTypes = {
  t: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  setNetworkError: PropTypes.func.isRequired,
  event: PropTypes.object,
  eventLanguages: PropTypes.array,
  eventClusters: PropTypes.array,
  eventParticipants: PropTypes.array,
  setEvent: PropTypes.func.isRequired,
  deleteEvent: PropTypes.func.isRequired,
  deleteWorkshopEvent: PropTypes.func.isRequired,
  addPeople: PropTypes.func.isRequired,
  addClusters: PropTypes.func.isRequired,
  addLanguages: PropTypes.func.isRequired,
  addActivities: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};
