import React from "react";
import PeopleTableRow from "./PeopleTableRow";
import Loading from "../shared/Loading";

export default function PeopleTable(props) {
  const filter = new RegExp(props.filter, "i");
  const people = props.people.filter(person =>
    `${person.first_name} ${person.last_name}`.match(filter)
  );
  const t = props.t;
  if (props.people.length == 0) {
    return <Loading />;
  }
  if (people.length == 0) {
    return <p>{t("NoneFound")}</p>;
  }
  return (
    <div>
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
