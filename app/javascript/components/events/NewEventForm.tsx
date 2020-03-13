import React, { useState, useContext } from "react";
import update from "immutability-helper";
import EditEventParticipantsTable from "./EditEventParticipantsTable";
import SaveButton from "../shared/SaveButton";
import Event, { IEventInflated, IEvent } from "../../models/Event";
import FormGroup from "../shared/FormGroup";
import ValidatedTextInput from "../shared/ValidatedTextInput";
import FuzzyDateInput from "../shared/FuzzyDateInput";
import TextArea from "../shared/TextArea";
import { Setter, Adder } from "../../models/TypeBucket";
import { ILanguage } from "../../models/Language";
import { IPerson } from "../../models/Person";
import { ICluster } from "../../models/Cluster";
import { IActivity } from "../../models/Activity";
import I18nContext from "../../contexts/I18nContext";
import { useAPIPost } from "../../util/useAPI";
import { emptyEvent } from "../../models/Event";
import EventCategoryPicker from "./EventCategoryPicker";
import { Domain } from "../../models/Domain";
import { T } from "../../i18n/i18n";
import P from "../shared/P";
import TyperPicker from "../shared/TyperPicker";

interface IProps {
  cancelForm: () => void;
  startEvent?: Partial<IEventInflated>;
  setEvent: Setter<IEvent>;
  addLanguages: Adder<ILanguage>;
  addPeople: Adder<IPerson>;
  addClusters: Adder<ICluster>;
  addActivities: Adder<IActivity>;
}

export default function NewEventForm(props: IProps) {
  const t = useContext(I18nContext);
  const [event, setEvent] = useState(newEvent(t, props.startEvent));

  const updateEvent = (mergeEvent: Partial<IEventInflated>) =>
    setEvent(update(event, { $merge: mergeEvent }));

  const eventInvalid = !event.name || !event.start_date;

  const actions = {
    setEvent: props.setEvent,
    addLanguages: props.addLanguages,
    addPeople: props.addPeople,
    addClusters: props.addClusters,
    addActivities: props.addActivities
  };
  const [saving, save] = useAPIPost(
    "/api/events",
    { event: Event.prepareEventParams(Event.ensureEndDate(event)) },
    actions
  );

  return (
    <div id="NewEventForm">
      <h3>{t("New_event")}</h3>
      <FormGroup>
        <ValidatedTextInput
          value={event.name}
          name="Name"
          setValue={name => updateEvent({ name })}
          placeholder={t("Name")}
          validateNotBlank
          autoFocus
        />
      </FormGroup>
      <EventCategoryPicker event={event} updateEvent={updateEvent} />
      <P>
        <label>{t("Start_date")}</label>
        <FuzzyDateInput
          date={event.start_date}
          handleDateInput={(date: string) => updateEvent({ start_date: date })}
          dateIsInvalid={() => updateEvent({ start_date: "" })}
        />
      </P>

      <P>
        <label>{t("End_date")}</label>
        <FuzzyDateInput
          date={event.end_date}
          handleDateInput={(date: string) => updateEvent({ end_date: date })}
          dateIsInvalid={() => updateEvent({ end_date: "" })}
        />
      </P>

      <FormGroup label={t("Location")}>
        <TyperPicker
          listUrl="/api/event_locations"
          value={event.location}
          setValue={location => updateEvent({ location })}
        />
      </FormGroup>

      <FormGroup label={t("Note")}>
        <TextArea value={event.note} setValue={note => updateEvent({ note })} />
      </FormGroup>

      <EditEventParticipantsTable event={event} replaceEvent={updateEvent} />

      <SaveButton
        onClick={() => save(props.cancelForm)}
        disabled={eventInvalid}
        saveInProgress={saving}
      />

      <button onClick={props.cancelForm} className="btnRed">
        {t("Cancel")}
      </button>
    </div>
  );
}

function newEvent(t: T, startEvent?: Partial<IEventInflated>): IEventInflated {
  let event = {
    ...emptyEvent(),
    domain: Object.keys(t("domains"))[0] as Domain,
    languages: [],
    clusters: [],
    event_participants: []
  };
  if (startEvent) Object.assign(event, startEvent);
  return event;
}
