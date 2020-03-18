import React from "react";
import EditActionBar from "../shared/EditActionBar";
import ParticipantRoles from "./ParticipantRoles";
import update from "immutability-helper";
import style from "./ParticipantView.css";
import TextOrFuzzyDateInput from "../shared/TextOrFuzzyDateInput";
import { Link } from "react-router-dom";
import Activity, { IActivity } from "../../models/Activity";
import Spacer from "../shared/Spacer";
import ProgressBar from "../shared/ProgressBar";
import Loading from "../shared/Loading";
import { fullName } from "../../models/Person";
import Participant, {
  IParticipant,
  IParticipantInflated
} from "../../models/Participant";
import { ILanguage } from "../../models/Language";
import List from "../../models/List";
import { History } from "history";
import { T } from "../../i18n/i18n";
import I18nContext from "../../contexts/I18nContext";
import useParticipants from "../participants/useParticipants";
import useAppSelector from "../../reducers/useAppSelector";
import useLoad, { useLoadOnMount } from "../shared/useLoad";

export interface IProps {
  id: number;
  history: History;
  basePath: string;

  // Inserted below
  participant: IParticipantInflated;
  activities: List<IActivity>;
  languages: List<ILanguage>;
  saveLoad: ReturnType<typeof useLoad>[0];
}

export default function ParticipantView(
  props: Omit<IProps, "participant" | "activities" | "languages" | "saveLoad">
) {
  const [saveLoad] = useLoad();

  const participant = useParticipants(ptpt => ptpt.id == props.id).get(
    props.id
  );
  const activities = useAppSelector(state => state.activities).filter(a =>
    a.participant_ids.includes(props.id)
  );
  const languages = useAppSelector(state => state.languages);

  useLoadOnMount(`/api/participants/${props.id}`, [props.id]);

  return (
    <BaseParticipantView
      {...props}
      {...{ participant, activities, languages, saveLoad }}
    />
  );
}

interface IState {
  participant?: IParticipant;
  editing?: boolean;
  saving?: boolean;
  edited?: boolean;
}

class BaseParticipantView extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
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
    const data = await this.props.saveLoad(duluAxios =>
      duluAxios.put(`/api/participants/${this.state.participant!.id}`, {
        participant: this.state.participant
      })
    );
    if (data) {
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
          person: fullName(this.props.participant.person),
          language: Participant.clusterProgram(this.props.participant).name
        })
      )
    ) {
      const success = await this.props.saveLoad(duluAxios =>
        duluAxios.delete(`/api/participants/${this.props.id}`)
      );
      if (success) {
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
          <div className="padBottom">
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
                {fullName(this.props.participant.person)}
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
                        to={`/languages/${activity.language_id}/activities/${activity.id}`}
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
