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
