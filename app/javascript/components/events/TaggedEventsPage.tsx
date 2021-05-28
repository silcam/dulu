import React from "react";
import { useLoadOnMount } from "../shared/useLoad";
import useAppSelector from "../../reducers/useAppSelector";
import EventRow from "../events/EventRow";

interface IProps {
  // language: ILanguage;
  id: number;
  history?: History;
  tag: string;
}

export default function TaggedEventsPage(props: IProps) {
  // This does a load action, which loads data into
  // redux. Thus you can when use the app selector
  // to get it back out.

  // TODO FIXME, this doesn't really work yet (obviously)
  // trying to figure out how it should work.
  // TODO: get the current language id by props., also on :37
  const loading = useLoadOnMount(
    `/api/languages/61/events/tagged/${props.tag}`
  );
  const taggedEvents = useAppSelector(state =>
    state.events.list.filter(e => e.tags.some(tag => tag.name == props.tag))
  );

  return loading ? (
    <div>{"Loading..."}</div>
  ) : (
    <div>
      <h1>Events in lang tagged {props.tag}</h1>
      <table>
        <tbody>
          {taggedEvents.map(event => (
            <EventRow key={event.id} event={event} basePath={"/languages/61"} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
