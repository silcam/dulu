import React from "react";
import PropTypes from "prop-types";
import InlineAddIcon from "../shared/icons/InlineAddIcon";
import NewParticipantForm from "./NewParticipantForm";
import update from "immutability-helper";

/*
  Used by LanguagePageContent and ClusterPage!
*/

export default class ParticipantsTable extends React.PureComponent {
  state = {};

  showCluster = participant => !!this.props.language && !!participant.cluster;

  addParticipant = participant => {
    const clusterProgram = this.props.cluster || this.props.language;
    this.props.replace(
      update(clusterProgram, { participants: { $push: [participant] } })
    );
  };

  render() {
    const participants = domainPeople(
      this.props.participants,
      this.props.domain
    );
    const t = this.props.t;

    return (
      <div>
        <h3>
          {t("People")}
          {this.props.can.manage_participants && (
            <InlineAddIcon
              onClick={() => this.setState({ showNewForm: true })}
            />
          )}
        </h3>
        {this.state.showNewForm && (
          <NewParticipantForm
            t={t}
            cancel={() => this.setState({ showNewForm: false })}
            addParticipant={this.addParticipant}
            program_id={this.props.language && this.props.language.id}
            cluster_id={this.props.cluster && this.props.cluster.id}
            setNetworkError={this.props.setNetworkError}
          />
        )}
        <table>
          <tbody>
            {participants.map(participant => (
              <tr key={participant.id}>
                <td>
                  {participant.person.full_name}{" "}
                  {this.showCluster(participant) &&
                    `(${participant.cluster.name})`}
                </td>
                <td>
                  {participant.roles.map(role => t(`roles.${role}`)).join(", ")}
                </td>
                <td>{participant.start_date}</td>
                <td>{participant.end_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

function domainPeople(participants, domain) {
  if (!domain) return participants;
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

ParticipantsTable.propTypes = {
  t: PropTypes.func.isRequired,
  domain: PropTypes.string,
  participants: PropTypes.array.isRequired,
  language: PropTypes.object,
  cluster: PropTypes.object,
  replace: PropTypes.func.isRequired,
  setNetworkError: PropTypes.func.isRequired,
  can: PropTypes.object.isRequired
};
