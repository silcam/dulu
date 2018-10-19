import React from "react";
import PropTypes from "prop-types";

export default function PeopleTable(props) {
  const people = domainPeople(props.language.participants, props.tab);
  return (
    <div>
      <h3>{props.t("People")}</h3>
      <table>
        <tbody>
          {people.map(person => (
            <tr key={person.id}>
              <td>{person.full_name}</td>
              <td>
                {person.roles.map(role => props.t(`roles.${role}`)).join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function domainPeople(participants, domain) {
  return participants.filter(participant =>
    participant.roles.some(role => domainFromRole(role) == domain)
  );
}

function domainFromRole(role) {
  const roleDomains = {
    Administration: "",
    BackTranslator: "Translation",
    DuluAdmin: "",
    Cluster_coordinator: "All",
    Cluster_facilitator: "All",
    Exegete: "Translation",
    Facilitator: "",
    LanguageProgramCommittee: "All",
    LanguageProgramFacilitator: "All",
    Leader: "",
    Linguist: "Linguistics",
    LinguisticConsultant: "Linguistics",
    LinguisticConsultantTraining: "Linguistics",
    Literacy_specialist: "Literacy",
    Literacy_consultant: "Literacy",
    MediaConsultant: "Media",
    MediaSpecialist: "Media",
    ProjectCoordinator: "All",
    Scripture_engagement_specialist: "Scripture_use",
    Student: "",
    Translator: "Translation",
    TranslationConsultant: "Translation",
    TranslationConsultantTraining: "Translation"
  };
  let domain = roleDomains[role];
  if (domain === undefined) console.error("No domain listed for role: " + role);
  return domain;
}

PeopleTable.propTypes = {
  t: PropTypes.func.isRequired,
  tab: PropTypes.string.isRequired,
  language: PropTypes.object.isRequired
};
