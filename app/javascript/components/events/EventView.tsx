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
import Event, { IEvent, IEventInflated } from "../../models/Event";
import FormGroup from "../shared/FormGroup";
import FuzzyDateInput from "../shared/FuzzyDateInput";
// import { useAPIGet, useAPIPut, useAPIDelete } from "../../util/useAPI";
import I18nContext from "../../contexts/I18nContext";
import { T } from "../../i18n/i18n";
import EventCategoryPicker from "./EventCategoryPicker";
import EventTagger from "./EventTagger";
import TyperPicker from "../shared/TyperPicker";
import useLoad, { useLoadOnMount } from "../shared/useLoad";
import useAppSelector, {
  useLanguages,
  useClusters,
  useEventParticipants
} from "../../reducers/useAppSelector";
import { useHistory } from "react-router-dom";

interface IProps {
  id: number;
}

export default function EventView(props: IProps) {
  const [saveLoad, saving] = useLoad();
  const storedEvent = useAppSelector(state => state.events.list.get(props.id));
  const eventLanguages = useLanguages(storedEvent.language_ids);
  const eventClusters = useClusters(storedEvent.cluster_ids);
  const eventParticipants = useEventParticipants(
    storedEvent.event_participants
  );

  const loading = useLoadOnMount(`/api/events/${props.id}`, [props.id]);
  const [draftEvent, setDraftEvent] = useState<IEventInflated | null>(null);
  const editing = draftEvent != null;
  const t = useContext(I18nContext);
  const history = useHistory();

  const updateEvent = (mergeEvent: Partial<IEvent>) =>
    setDraftEvent(update(draftEvent, { $merge: mergeEvent }));

  const edit = () => {
    setDraftEvent({
      ...storedEvent,
      languages: [...eventLanguages],
      clusters: [...eventClusters],
      event_participants: [...eventParticipants]
    });
  };

  const cancelEdit = () => {
    setDraftEvent(null);
  };

  const eventIsInvalid = () => !!draftEvent && draftEvent.name.length == 0;

  const saveEvent = async () => {
    const data = await saveLoad(duluAxios =>
      duluAxios.put(`/api/events/${props.id}`, {
        event: draftEvent
          ? Event.prepareEventParams(draftEvent, eventParticipants)
          : {}
      })
    );
    if (data) setDraftEvent(null);
  };

  const deleteEvent = async () => {
    if (confirm(t("confirm_delete_event", { name: storedEvent.name }))) {
      const data = await saveLoad(duluAxios =>
        duluAxios.delete(`/api/events/${props.id}`)
      );
      if (data) history.goBack();
    }
  };

  const event = editing ? draftEvent : storedEvent;
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

        <EventTagger
          editing={editing}
          event={event}
          updateEvent={updateEvent}
        />

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

        {editing ? (
          <FormGroup label={t("Location")}>
            <TyperPicker
              listUrl="/api/event_locations"
              value={event.location}
              setValue={location => updateEvent({ location })}
            />
          </FormGroup>
        ) : event.location ? (
          <h4>{event.location.name}</h4>
        ) : null}

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
              eventLanguages={eventLanguages}
              eventClusters={eventClusters}
              eventParticipants={eventParticipants}
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
