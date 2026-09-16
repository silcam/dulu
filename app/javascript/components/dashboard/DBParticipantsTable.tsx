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

  // Stringified so the dependency is one stable value, the way DBActivitiesTable
  // already does it. The previous form passed `props.languageIds` *as* the dependency
  // array rather than as a dependency, and React compares dependency arrays pairwise
  // only up to min(prev.length, next.length): a selection that was a superset of the
  // previous one with the same leading ids compared equal on every index React looked
  // at, so the effect was skipped and the extra languages were never fetched.
  // Selecting North Region and then Cameroon -- the largest selection there is --
  // fetched nothing at all. dashboardPeople.spec.js covers it.
  const languageIdsKey = JSON.stringify(props.languageIds);

  /* eslint-disable react-hooks/exhaustive-deps --
     languageIdsKey is exactly a stringification of props.languageIds, which the rule
     cannot see through, and `load` is redefined on every render by useLoad, so listing
     it would refire this on every render. A block rather than a disable-next-line
     because the rule reports on the dependency array, not on the useEffect call. */
  useEffect(() => {
    // forEach, not map: the return value was discarded, and the callback was marked
    // async while awaiting nothing.
    props.languageIds.forEach(id =>
      load(duluAxios => duluAxios.get(`/api/languages/${id}/participants`))
    );
  }, [languageIdsKey]);
  /* eslint-enable react-hooks/exhaustive-deps */

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
