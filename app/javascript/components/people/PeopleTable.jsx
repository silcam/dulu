import React from "react";
import PeopleTableRow from "./PeopleTableRow";
import { Link } from "react-router-dom";
import Loading from "../shared/Loading";

export default function PeopleTable(props) {
  const people = props.people;
  const t = props.t;
  if (people.length == 0) {
    return <Loading t={t} />;
  }
  return (
    <div>
      {props.can.create && (
        <p style={{ paddingLeft: "8px" }}>
          <Link to="/people/new" className="btn">
            {t("Add_new_person")}
          </Link>
        </p>
      )}
      <table>
        <tbody>
          {people.map(person => (
            <PeopleTableRow
              key={person.id}
              person={person}
              selected={props.id == person.id}
              t={t}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
