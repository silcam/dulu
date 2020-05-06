import React, { useState, useEffect, useContext } from "react";
import DomainFilterer from "./DomainFilterer";
import { Link } from "react-router-dom";
import { fullName } from "../../models/Person";
import CommaList from "../shared/CommaList";
import usePeopleParticipants from "./usePeopleParticipants";
import { domainFromRole } from "../../models/Role";
import I18nContext from "../../contexts/I18nContext";
import StyledTable from "../shared/StyledTable";
import useLoad from "../shared/useLoad";

export interface IProps {
  languageIds: number[];
}

export default function DBParticipantsTable(props: IProps) {
  const t = useContext(I18nContext);
  const [load] = useLoad();
  const [domainFilter, setDomainFilter] = useState("All");

  const { people, participants } = usePeopleParticipants(props.languageIds);

  const filteredPeople =
    domainFilter == "All"
      ? people
      : people.filter(person =>
          participants[person.id].some(ptpt =>
            ptpt.roles.some(role => domainFromRole(role) == domainFilter)
          )
        );

  useEffect(() => {
    props.languageIds.map(async id => {
      load(duluAxios => duluAxios.get(`/api/languages/${id}/participants`));
    });
  }, props.languageIds);

  return (
    <div>
      {people.length > 0 && (
        <DomainFilterer
          domainFilter={domainFilter}
          setDomainFilter={setDomainFilter}
        />
      )}
      <StyledTable>
        <tbody>
          {filteredPeople.map(person => {
            const personParticipants = participants[person.id];
            const roles = personParticipants.reduce(
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
                    list={personParticipants}
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
