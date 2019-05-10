import React from "react";
import PeopleTableRow from "./PeopleTableRow";
import Loading from "../shared/Loading";
import List from "../../models/List";
import { IPerson } from "../../models/Person";

interface IProps {
  people: List<IPerson>;
  id?: number;
}

export default function PeopleTable(props: IProps) {
  if (props.people.length() == 0) {
    return <Loading />;
  }
  return (
    <div>
      <table>
        <tbody>
          {props.people.map(person => (
            <PeopleTableRow
              key={person.id}
              person={person}
              selected={props.id == person.id}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
