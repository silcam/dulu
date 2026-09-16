import React, { useEffect, useContext, useState } from "react";
import DuluAxios from "../../util/DuluAxios";
import style from "./EventsCalendar.css";
import { Link } from "react-router-dom";
import {
  monthBefore,
  monthAfter,
  monthName,
  periodToGetParams,
  IMonth
} from "./dateUtils";
import AddIcon from "../shared/icons/AddIcon";
import MonthColumnContainer from "./MonthColumnContainer";
import { Adder, SetCan } from "../../models/TypeBucket";
import { IPerson } from "../../models/Person";
import { ILanguage } from "../../models/Language";
import { ICluster } from "../../models/Cluster";
import { ICan } from "../../actions/canActions";
import { IEvent, IPeriod } from "../../models/Event";
import I18nContext from "../../contexts/I18nContext";
import NewEventForm from "./NewEventForm";

export interface IProps {
  year: string;
  month: string;
  addEvents: (e: IEvent[], p: IPeriod) => void;
  setCan: SetCan;
  addPeople: Adder<IPerson>;
  addLanguages: Adder<ILanguage>;
  addClusters: Adder<ICluster>;
  can: ICan;
}

export default function EventsCalendar(props: IProps) {
  const t = useContext(I18nContext);
  const centerMonth = {
    year: parseInt(props.year),
    month: parseInt(props.month)
  };

  // Both effects read `centerMonth` and `props`, and neither is listed.
  //
  // `centerMonth` is computed above from props.year and props.month and nothing else,
  // so the second effect's list already names everything it depends on; adding the
  // object itself would only mean a fresh identity every render and a preload on each
  // one. `props` is the wrong dependency by the rule's own account -- it changes when
  // any prop changes, and what these effects actually use out of it are the adder
  // callbacks, which the parent rebuilds every render.
  //
  // The first effect is a mount-only load on purpose: the second one handles every
  // subsequent month, so listing anything here would refetch the centre month twice.
  /* eslint-disable react-hooks/exhaustive-deps -- see the note above */

  // Initial Load
  useEffect(() => {
    const period = {
      start: monthBefore(centerMonth),
      end: monthAfter(centerMonth)
    };
    getEvents(period, props);
  }, []);

  // Preload adjacent months
  useEffect(() => {
    preloadEvents(centerMonth, props);
  }, [props.year, props.month]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const [addingNew, setAddingNew] = useState(false);

  const leftMonth = monthBefore(centerMonth);
  const rightMonth = monthAfter(centerMonth);

  return (
    <div className={style.container}>
      <div className={style.header}>
        <h2>
          {t("Events")}
          {props.can.create && (
            <AddIcon iconSize="large" onClick={() => setAddingNew(true)} />
          )}
        </h2>
        {addingNew && <NewEventForm cancelForm={() => setAddingNew(false)} />}
        <Link
          to={`/events/cal/${leftMonth.year}/${leftMonth.month}`}
          className="btn"
        >
          {"< " + monthName(monthBefore(leftMonth).month, t)}
        </Link>
        <Link
          to={`/events/cal/${rightMonth.year}/${rightMonth.month}`}
          className="btn"
          style={{ float: "right" }}
        >
          {monthName(monthAfter(rightMonth).month, t) + " >"}
        </Link>
      </div>
      <div className={style.calendar}>
        <MonthColumnContainer month={leftMonth} />
        <MonthColumnContainer month={centerMonth} />
        <MonthColumnContainer month={rightMonth} />
      </div>
    </div>
  );
}

function preloadEvents(centerMonth: IMonth, props: IProps) {
  const leftOfLeft = monthBefore(monthBefore(centerMonth));
  const rightOfRight = monthAfter(monthAfter(centerMonth));
  getEvents({ start: leftOfLeft, end: leftOfLeft }, props);
  getEvents({ start: rightOfRight, end: rightOfRight }, props);
}

async function getEvents(period: IPeriod, props: IProps) {
  const data = await DuluAxios.get("/api/events", periodToGetParams(period));
  if (data) {
    props.addPeople(data.people);
    props.addLanguages(data.languages);
    props.addClusters(data.clusters);
    props.setCan("events", data.can.events);
    props.addEvents(data.events, period);
  }
}
