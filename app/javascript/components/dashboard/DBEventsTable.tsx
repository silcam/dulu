import React, { useEffect, useRef, useState } from "react";
import { IEvent, IPeriod } from "../../models/Event";
import DuluAxios from "../../util/DuluAxios";
import { lastYear } from "../../util/Date";
import { Adder, SetCan } from "../../models/TypeBucket";
import { IPerson } from "../../models/Person";
import { ICan } from "../../actions/canActions";
import BasicEventsTable from "../events/BasicEventsTable";
import DomainFilterer from "./DomainFilterer";
import List from "../../models/List";

interface IProps {
  languageIds: number[];
  events: List<IEvent>;
  eventsBackTo: number | undefined;
  can: ICan;

  addPeople: Adder<IPerson>;
  setCan: SetCan;
  addEventsForLanguage: (e: IEvent[], lid: number, p: IPeriod) => void;
}

export default function DBEventsTable(props: IProps) {
  const [loadingMore, setLoadingMore] = useState(false);
  const [domainFilter, setDomainFilter] = useState("All");

  // `loadingMore` alone used to be the guard, but it doesn't say *which* languageIds
  // it belongs to. The dashboard's selection (and so `props.languageIds`) can change
  // while a fetch for the old selection is still in flight -- either from clicking
  // through the sidebar, or on a bare page load, since `DuluApp`'s mount effect
  // dispatches the user's saved view_prefs (and so the real dashboardSelection) one
  // render after the default selection already rendered and started fetching. The
  // stale fetch's completion flips `loadingMore` back to false, and without this ref
  // that reopens the guard for whatever selection is current -- even mid-fetch for it
  // -- producing duplicate/looping requests. Keying the guard on languageIds instead
  // closes that: a key is only fetched once, and a stale completion no longer
  // unblocks a selection it wasn't fetching for.
  const attemptedKeyRef = useRef<string | null>(null);
  const languageIdsKey = [...props.languageIds].sort((a, b) => a - b).join(",");

  // No dependency list on purpose: the effect is meant to run after every render and
  // decide for itself -- adding [props, loadingMore] as the rule suggests would change
  // nothing except to make the same run conditional on an object the parent rebuilds
  // every render anyway.
  /* eslint-disable react-hooks/exhaustive-deps -- see the note above */
  useEffect(() => {
    if (
      props.eventsBackTo == undefined &&
      !loadingMore &&
      attemptedKeyRef.current !== languageIdsKey
    ) {
      attemptedKeyRef.current = languageIdsKey;
      getEvents(props, setLoadingMore);
    }
  });
  /* eslint-enable react-hooks/exhaustive-deps */

  const moreEvents = () => {
    if (!props.eventsBackTo) return;
    getEvents(props, setLoadingMore, props.eventsBackTo - 1);
  };

  const events =
    domainFilter == "All"
      ? props.events
      : props.events.filter(e => e.domain == domainFilter);

  return props.events.length() == 0 ? (
    <div />
  ) : (
    <div>
      <DomainFilterer
        domainFilter={domainFilter}
        setDomainFilter={setDomainFilter}
      />
      <BasicEventsTable
        events={events}
        can={props.can}
        noHeader
        moreEventsState={
          loadingMore ? "loading" : props.eventsBackTo == 0 ? "none" : "button"
        }
        moreEvents={moreEvents}
      />
    </div>
  );
}

async function getEvents(
  props: IProps,
  setLoadingMore: (b: boolean) => void,
  year?: number
) {
  setLoadingMore(true);
  const params = year
    ? { start_year: year, end_year: year }
    : { start_year: lastYear() };
  await Promise.all(
    props.languageIds.map(async id => {
      const data = await DuluAxios.get(`/api/languages/${id}/events`, params);
      if (data) {
        props.addPeople(data.people);
        props.setCan("events", data.can.events);
        props.addEventsForLanguage(data.events, id, {
          start: data.startYear ? { year: data.startYear } : undefined,
          end: year ? { year: year } : undefined
        });
      }
    })
  );
  setLoadingMore(false);
}
