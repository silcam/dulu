import React, { useState, useEffect, useContext } from "react";
import DomainFilterer from "./DomainFilterer";
import { Link } from "react-router-dom";
import { fullName, Person } from "../../models/Person";
import CommaList from "../shared/CommaList";
import { PeopleParticipants } from "./DBParticipantsContainer";
import { Adder } from "../../models/TypeBucket";
import DuluAxios from "../../util/DuluAxios";
import Role from "../../models/Role";
import I18nContext from "../../application/I18nContext";
import StyledTable from "../shared/StyledTable";
import { IParticipant } from "../../models/Participant";

export interface IProps extends PeopleParticipants {
  languageIds: number[];
  addPeople: Adder<Person>;
  addParticipants: Adder<IParticipant>;
}

export default function DBParticipantsTable(props: IProps) {
  const t = useContext(I18nContext);
  const [domainFilter, setDomainFilter] = useState("All");

  useEffect(() => {
    fetchParticipants(props);
  }, [JSON.stringify(props.languageIds)]);

  const people =
    domainFilter == "All"
      ? props.people
      : props.people.filter(person =>
          props.participants[person.id].some(ptpt =>
            ptpt.roles.some(role => Role.domainFromRole(role) == domainFilter)
          )
        );

  return (
    <div>
      {props.people.length > 0 && (
        <DomainFilterer
          domainFilter={domainFilter}
          setDomainFilter={setDomainFilter}
        />
      )}
      <StyledTable>
        <tbody>
          {people.map(person => {
            const participants = props.participants[person.id];
            const roles = participants.reduce(
              (accum: string[], ptpt) =>
                accum.concat(ptpt.roles.filter(role => !accum.includes(role))),
              []
            );
            return (
              <tr key={person.id}>
                <td>
                  <Link to={`/people/${person.id}`}>{fullName(person)}</Link>
                </td>
                <td>
                  <CommaList
                    list={participants}
                    render={ptpt => (
                      <Link to={ptpt.program.path}>{ptpt.program.name}</Link>
                    )}
                  />
                </td>
                <td>
                  <CommaList list={roles} render={role => t(`roles.${role}`)} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </StyledTable>
    </div>
  );
}

async function fetchParticipants(props: IProps) {
  await Promise.all(
    props.languageIds.map(async id => {
      const data = await DuluAxios.get(`/api/languages/${id}/participants`);
      if (data) {
        props.addPeople(data.people);
        props.addParticipants(data.participants);
      }
    })
  );
}
