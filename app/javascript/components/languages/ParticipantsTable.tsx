import React from "react";
import InlineAddIcon from "../shared/icons/InlineAddIcon";
import NewParticipantForm from "./NewParticipantForm";
import Role from "../../models/Role";
import { Link } from "react-router-dom";
import DuluAxios from "../../util/DuluAxios";
import { fullName, Person } from "../../models/Person";
import { T } from "../../i18n/i18n";
import { BasicModel } from "../../models/BasicModel";
import { ICluster } from "../../models/Cluster";
import { History } from "history";
import {
  IParticipantInflated,
  Adder,
  IParticipant,
  Setter
} from "../../models/TypeBucket";
import { ILanguage } from "../../models/Language";

/*
  Used by LanguagePageContent and ClusterPage!
*/

interface IProps {
  t: T;
  domain?: string;
  participants: IParticipantInflated[];
  language?: BasicModel;
  cluster?: ICluster;
  can: { manage_participants?: boolean };
  basePath: string;
  history: History<any>;
  addParticipants: Adder<IParticipant>;
  addPeople: Adder<Person>;
  setLanguage: Setter<ILanguage>;
  setCluster: Setter<ICluster>;
}

interface IState {
  showNewForm?: boolean;
}

export default class ParticipantsTable extends React.PureComponent<
  IProps,
  IState
> {
  state: IState = {};

  async componentDidMount() {
    const url = this.props.language
      ? `/api/languages/${this.props.language.id}/participants`
      : `/api/clusters/${this.props.cluster!.id}/participants`;
    const data = await DuluAxios.get(url);
    if (data) {
      data.language && this.props.setLanguage(data.language);
      data.cluster && this.props.setCluster(data.cluster);
      this.props.addPeople(data.people);
      this.props.addParticipants(data.participants);
    }
  }

  showCluster = (participant: IParticipantInflated) =>
    !!this.props.language && !!participant.cluster;

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
            history={this.props.history}
            basePath={this.props.basePath}
          />
        )}
        <table>
          <tbody>
            {participants.map((participant: IParticipantInflated) => (
              <tr key={participant.id}>
                <td>
                  <Link
                    to={`${this.props.basePath}/participants/${participant.id}`}
                  >
                    {fullName(participant.person)}
                  </Link>{" "}
                  {this.showCluster(participant) &&
                    `(${participant.cluster!.name})`}
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

function domainPeople(participants: IParticipantInflated[], domain?: string) {
  if (!domain) return participants;
  return participants.filter(participant =>
    participant.roles.some(role => Role.domainFromRole(role) == domain)
  );
}