import React from "react";
import PropTypes from "prop-types";
import InlineAddIcon from "../shared/icons/InlineAddIcon";
import NewParticipantForm from "./NewParticipantForm";
import Role from "../../models/Role";
import { Link } from "react-router-dom";
import DuluAxios from "../../util/DuluAxios";
import { fullName } from "../../models/person";

/*
  Used by LanguagePageContent and ClusterPage!
*/

export default class ParticipantsTable extends React.PureComponent {
  state = {};

  async componentDidMount() {
    try {
      const url = this.props.language
        ? `/api/languages/${this.props.language.id}/participants`
        : `/api/clusters/${this.props.cluster.id}/participants`;
      const data = await DuluAxios.get(url);
      data.language && this.props.setLanguage(data.language);
      data.cluster && this.props.setCluster(data.cluster);
      this.props.addPeople(data.people);
      this.props.addParticipants(data.participants);
    } catch (error) {
      this.props.setNetworkError(error);
    }
  }

  showCluster = participant => !!this.props.language && !!participant.cluster;

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
            addParticipants={this.props.addParticipants}
            addPeople={this.props.addPeople}
            language_id={this.props.language && this.props.language.id}
            cluster_id={this.props.cluster && this.props.cluster.id}
            setNetworkError={this.props.setNetworkError}
            history={this.props.history}
            basePath={this.props.basePath}
          />
        )}
        <table>
          <tbody>
            {participants.map(participant => (
              <tr key={participant.id}>
                <td>
                  <Link
                    to={`${this.props.basePath}/participants/${participant.id}`}
                  >
                    {fullName(this.props.people[participant.person_id])}
                  </Link>{" "}
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
    participant.roles.some(role => Role.domainFromRole(role) == domain)
  );
}

ParticipantsTable.propTypes = {
  t: PropTypes.func.isRequired,
  domain: PropTypes.string,
  participants: PropTypes.array.isRequired,
  people: PropTypes.object.isRequired,
  language: PropTypes.object,
  cluster: PropTypes.object,
  setNetworkError: PropTypes.func.isRequired,
  can: PropTypes.object.isRequired,
  basePath: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  addParticipants: PropTypes.func.isRequired,
  addPeople: PropTypes.func.isRequired,
  setLanguage: PropTypes.func.isRequired,
  setCluster: PropTypes.func.isRequired
};
