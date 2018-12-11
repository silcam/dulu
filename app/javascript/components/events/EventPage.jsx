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

export default class EventPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  async componentDidMount() {
    try {
      const data = await DuluAxios.get(`/api/events/${this.props.id}`);
      this.setState({
        event: data.event,
        can: data.can,
        loading: false
      });
    } catch (error) {
      this.props.setNetworkError(error);
      this.setState({ loading: false });
    }
  }

  updateEvent = mergeEvent => {
    this.setState(prevState => ({
      event: update(prevState.event, { $merge: mergeEvent })
    }));
  };

  edit = () => {
    this.setState(prevState => ({
      eventBackup: deepcopy(prevState.event),
      editing: true
    }));
  };

  cancelEdit = () => {
    this.setState(prevState => ({
      event: prevState.eventBackup,
      editing: false
    }));
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
      const data = await DuluAxios.put(`/api/events/${this.props.id}`, {
        event: event
      });
      this.setState({
        event: data.event,
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
        this.props.t("confirm_delete_event", { name: this.state.event.name })
      )
    ) {
      try {
        await DuluAxios.delete(`/api/events/${this.state.event.id}`);
        this.props.history.replace("/events");
      } catch (error) {
        this.props.setNetworkError(error);
      }
    }
  };

  render() {
    const t = this.props.t;
    const event = this.state.event;
    return (
      <div className={style.eventPage}>
        {this.state.loading && <Loading t={t} />}
        {event && (
          <div>
            <EditActionBar
              can={this.state.can}
              editing={this.state.editing}
              saving={this.state.saving}
              save={this.save}
              saveDisabled={this.eventIsInvalid()}
              cancel={this.cancelEdit}
              edit={this.edit}
              delete={this.delete}
              t={t}
            />
            <h2>
              <TextOrEditText
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
                  handleChange={e =>
                    this.updateEvent({ domain: e.target.value })
                  }
                  options={selectOptionsFromObject(t("domains"))}
                />
                <FuzzyDateGroup
                  label={t("Start_date")}
                  date={event.start_date}
                  handleDateInput={date =>
                    this.updateEvent({ start_date: date })
                  }
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
                  t={t}
                  can={this.state.can}
                />
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

EventPage.propTypes = {
  id: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  setNetworkError: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};
