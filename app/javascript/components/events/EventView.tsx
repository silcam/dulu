import React, { useState, useContext } from "react";
import Loading from "../shared/Loading";
import EditActionBar from "../shared/EditActionBar";
import eventDateString from "../../util/eventDateString";
import EventsParticipantsTable from "./EventsParticipantsTable";
import TextOrEditText from "../shared/TextOrEditText";
import update from "immutability-helper";
import TextOrTextArea from "../shared/TextOrTextArea";
import style from "./EventPage.css";
import P from "../shared/P";
import EditEventParticipantsTable from "./EditEventParticipantsTable";
import Event, {
  IEvent,
  IEventParticipantExtended,
  IEventInflated
} from "../../models/Event";
import FormGroup from "../shared/FormGroup";
import FuzzyDateInput from "../shared/FuzzyDateInput";
import { ILanguage } from "../../models/Language";
import { ICluster } from "../../models/Cluster";
import { Setter, Adder } from "../../models/TypeBucket";
import { IPerson } from "../../models/Person";
import { IActivity } from "../../models/Activity";
import { History } from "history";
import { useAPIGet, useAPIPut, useAPIDelete } from "../../util/useAPI";
import I18nContext from "../../contexts/I18nContext";
import { T } from "../../i18n/i18n";
import EventCategoryPicker from "./EventCategoryPicker";

interface IProps {
  id: number;
  event?: IEvent;
  eventLanguages: ILanguage[];
  eventClusters: ICluster[];
  eventParticipants: IEventParticipantExtended[];
  setEvent: Setter<IEvent>;
  deleteEvent: (id: number) => void;
  deleteWorkshopEvent: (activityId: number, wsId: number) => void;
  addPeople: Adder<IPerson>;
  addClusters: Adder<ICluster>;
  addLanguages: Adder<ILanguage>;
  addActivities: Adder<IActivity>;
  history: History;
}

export default function EventView(props: IProps) {
  const actions = {
    setEvent: props.setEvent,
    addPeople: props.addPeople,
    addClusters: props.addClusters,
    addLanguages: props.addLanguages,
    addActivities: props.addActivities,
    deleteItem: props.deleteEvent
  };
  const loading = useAPIGet(`/api/events/${props.id}`, {}, actions);
  const [draftEvent, setDraftEvent] = useState<IEventInflated | null>(null);
  const editing = draftEvent != null;
  const t = useContext(I18nContext);

  const updateEvent = (mergeEvent: Partial<IEvent>) =>
    setDraftEvent(update(draftEvent, { $merge: mergeEvent }));

  const edit = () => {
    props.event &&
      setDraftEvent({
        ...props.event,
        languages: [...props.eventLanguages],
        clusters: [...props.eventClusters],
        event_participants: [...props.eventParticipants]
      });
  };

  const cancelEdit = () => {
    setDraftEvent(null);
  };

  const eventIsInvalid = () => !!draftEvent && draftEvent.name.length == 0;

  const [saving, save] = useAPIPut(
    `/api/events/${props.id}`,
    {
      event: draftEvent
        ? Event.prepareEventParams(draftEvent, props.eventParticipants)
        : {}
    },
    actions
  );
  const saveEvent = () => save(() => setDraftEvent(null));

  const [, deleteItem] = useAPIDelete(
    `/api/events/${props.id}`,
    actions,
    t("confirm_delete_event", { name: props.event ? props.event.name : "" })
  );
  const deleteEvent = () =>
    deleteItem(() => {
      props.history.goBack();
      props.deleteEvent(props.id);
      if (props.event && props.event.workshop_id) {
        props.deleteWorkshopEvent(
          props.event.workshop_activity_id!,
          props.event.workshop_id
        );
      }
    });

  const event = editing ? draftEvent : props.event;
  if (!event || event.id == 0) return <Loading />;
  return (
    <div className={style.eventPage}>
      <div>
        {!loading && (
          <EditActionBar
            can={event.can}
            editing={editing}
            saving={saving}
            save={saveEvent}
            saveDisabled={editing && eventIsInvalid()}
            cancel={cancelEdit}
            edit={edit}
            delete={deleteEvent}
          />
        )}
        <h2>
          <TextOrEditText
            name="name"
            editing={editing}
            value={event.name}
            setValue={value => updateEvent({ name: value })}
            validateNotBlank
          />
          {!editing && (
            <span>
              <br />
              <span className="subheader">{domainCategoryText(event, t)}</span>
            </span>
          )}
        </h2>

        {editing ? (
          <div>
            <EventCategoryPicker event={event} updateEvent={updateEvent} />
            <P>
              <label>{t("Start_date")}</label>
              <FuzzyDateInput
                date={event.start_date}
                handleDateInput={(date: string) =>
                  updateEvent({ start_date: date })
                }
                divId="startDateInput"
              />
            </P>
            <P>
              <label>{t("End_date")}</label>
              <FuzzyDateInput
                date={event.end_date}
                handleDateInput={(date: string) =>
                  updateEvent({ end_date: date })
                }
                divId="endDateInput"
              />
            </P>
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
            editing={editing}
            value={event.note}
            setValue={value => updateEvent({ note: value })}
          />
        </P>
        <div className={style.participantsTable}>
          {editing ? (
            <EditEventParticipantsTable
              event={draftEvent!}
              replaceEvent={updateEvent}
            />
          ) : (
            <EventsParticipantsTable
              event={event}
              eventLanguages={props.eventLanguages}
              eventClusters={props.eventClusters}
              eventParticipants={props.eventParticipants}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function domainCategoryText(event: IEvent, t: T) {
  let text = t(`domains.${event.domain}`) as string;
  if (event.category) {
    text += " > " + t(event.category);
    if (event.subcategory) {
      text += " > " + t(event.subcategory);
    }
  }
  return text;
}
