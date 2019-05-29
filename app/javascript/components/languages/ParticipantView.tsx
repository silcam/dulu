import React from "react";
import EditActionBar from "../shared/EditActionBar";
import DuluAxios from "../../util/DuluAxios";
import ParticipantRoles from "./ParticipantRoles";
import update from "immutability-helper";
import style from "./ParticipantView.css";
import TextOrFuzzyDateInput from "../shared/TextOrFuzzyDateInput";
import { Link } from "react-router-dom";
import Activity, { IActivity } from "../../models/Activity";
import Spacer from "../shared/Spacer";
import ProgressBar from "../shared/ProgressBar";
import Loading from "../shared/Loading";
import { fullName, IPerson } from "../../models/Person";
import { IParticipant } from "../../models/Participant";
import { ClusterLanguage } from "../regions/ProgramList";
import { ILanguage } from "../../models/Language";
import List from "../../models/List";
import { History } from "history";
import { Setter, Adder } from "../../models/TypeBucket";
import { ICluster } from "../../models/Cluster";
import { T } from "../../i18n/i18n";
import I18nContext from "../../contexts/I18nContext";

export interface IProps {
  id: number;
  participant?: IParticipant;
  person?: IPerson;
  activities?: List<IActivity>;
  clusterLanguage?: ClusterLanguage;
  languages: List<ILanguage>;

  history: History;
  basePath: string;
  setPerson: Setter<IPerson>;
  addParticipants: Adder<IParticipant>;
  deleteParticipant: (id: number) => void;
  addActivities: Adder<IActivity>;
  setLanguage: Setter<ILanguage>;
  setCluster: Setter<ICluster>;
  addLanguages: Adder<ILanguage>;

  // language?: ILanguage // If in a language context
  // cluster?: ICluster
}

interface IState {
  participant?: IParticipant;
  editing?: boolean;
  saving?: boolean;
  edited?: boolean;
}

export default class ParticipantView extends React.PureComponent<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const data = await DuluAxios.get(`/api/participants/${this.props.id}`);
    if (data) {
      this.props.setPerson(data.person);
      data.language && this.props.setLanguage(data.language);
      data.cluster && this.props.setCluster(data.cluster);
      data.languages && this.props.addLanguages(data.languages);
      this.props.addParticipants([data.participant]);
      this.props.addActivities(data.activities);
    }
  }

  updateParticipant = (mergeParticipant: Partial<IParticipant>) => {
    this.setState(prevState => ({
      participant: update(prevState.participant, { $merge: mergeParticipant }),
      edited: true
    }));
  };

  edit = () =>
    this.props.participant &&
    this.setState({
      participant: { ...this.props.participant },
      editing: true
    });

  save = async () => {
    this.setState({ saving: true });
    const data = await DuluAxios.put(
      `/api/participants/${this.state.participant!.id}`,
      {
        participant: this.state.participant
      }
    );
    if (data) {
      this.props.addParticipants([data.participant]);
      this.setState({
        editing: false,
        participant: undefined
      });
    }
    this.setState({ saving: false });
  };

  delete = async (t: T) => {
    if (
      confirm(
        t("confirm_delete_participant", {
          person: fullName(this.props.person!),
          language: this.props.clusterLanguage!.name
        })
      )
    ) {
      const success = await DuluAxios.delete(
        `/api/participants/${this.props.id}`
      );
      if (success) {
        this.props.deleteParticipant(this.props.id);
        this.props.history.push(this.props.basePath);
      }
    }
  };

  invalid = () => this.state.editing && !this.state.participant!.start_date;

  render() {
    const participant = this.state.editing
      ? this.state.participant
      : this.props.participant;

    if (!participant || participant.id == 0) return <Loading />;
    const can = this.props.participant!.can || {};

    return (
      <I18nContext.Consumer>
        {t => (
          <div>
            <EditActionBar
              can={can}
              editing={this.state.editing}
              saving={this.state.saving}
              save={this.save}
              saveDisabled={this.invalid() || !this.state.edited}
              cancel={() =>
                this.setState({
                  editing: false,
                  participant: undefined
                })
              }
              edit={this.edit}
              delete={() => this.delete(t)}
            />
            <h2>
              <Link className="notBlue" to={`/people/${participant.person_id}`}>
                {fullName(this.props.person!)}
              </Link>
            </h2>
            <ParticipantRoles
              participant={participant}
              replaceRoles={roles => this.updateParticipant({ roles: roles })}
              editing={this.state.editing}
            />
            {this.state.editing && <h3>{t("Dates")}</h3>}
            <table className={style.simple}>
              <tbody>
                <tr>
                  <th>{t("Joined_program")}</th>
                  <td>
                    <TextOrFuzzyDateInput
                      editing={this.state.editing}
                      date={participant.start_date}
                      handleDateInput={date =>
                        this.updateParticipant({ start_date: date })
                      }
                      dateIsInvalid={() =>
                        this.updateParticipant({ start_date: "" })
                      }
                    />{" "}
                  </td>
                </tr>
                {(participant.end_date || this.state.editing) && (
                  <tr>
                    <th>{t("Left_program")}</th>
                    <td>
                      <TextOrFuzzyDateInput
                        editing={this.state.editing}
                        date={participant.end_date || ""}
                        handleDateInput={date =>
                          this.updateParticipant({ end_date: date })
                        }
                        allowBlank={true}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {!this.state.editing && (
              <div style={{ paddingTop: "20px" }}>
                <h3>{t("Activities")}</h3>
                <ul className={style.stdList}>
                  {this.props.activities!.map(activity => (
                    <li key={activity.id}>
                      <ProgressBar {...Activity.progress(activity)} small />
                      <Spacer width="10px" />
                      {this.props.languages.get(activity.language_id).name}
                      <Spacer width="10px" />
                      <Link
                        to={`/languages/${activity.language_id}/activities/${
                          activity.id
                        }`}
                      >
                        {Activity.name(activity, t)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </I18nContext.Consumer>
    );
  }
}
