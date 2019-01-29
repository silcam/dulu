import React from "react";
import PropTypes from "prop-types";
import EditActionBar from "../shared/EditActionBar";
import deepcopy from "../../util/deepcopy";
import DuluAxios from "../../util/DuluAxios";
import ParticipantRoles from "./ParticipantRoles";
import update from "immutability-helper";
import style from "./ParticipantView.css";
import TextOrFuzzyDateInput from "../shared/TextOrFuzzyDateInput";
import Participant from "../../models/Participant";
import { Link } from "react-router-dom";
import Activity from "../../models/Activity";
import Spacer from "../shared/Spacer";
import ProgressBar from "../shared/ProgressBar";
export default class ParticipantView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      participant: deepcopy(props.participant)
    };
  }

  updateParticipant = mergeParticipant => {
    this.setState(prevState => ({
      participant: update(prevState.participant, { $merge: mergeParticipant }),
      edited: true
    }));
  };

  save = async () => {
    this.setState({ saving: true });
    try {
      const data = await DuluAxios.put(
        `/api/participants/${this.state.participant.id}`,
        {
          participant: this.state.participant
        }
      );
      this.props.replaceParticipant(data.participant);
      this.setState({
        editing: false,
        participant: deepcopy(data.participant)
      });
    } catch (error) {
      this.props.setNetworkError(error);
    } finally {
      this.setState({ saving: false });
    }
  };

  delete = async () => {
    if (
      confirm(
        this.props.t("confirm_delete_participant", {
          person: this.state.participant.person.full_name,
          program: Participant.clusterProgram(this.state.participant).name
        })
      )
    ) {
      try {
        await DuluAxios.delete(
          `/api/participants/${this.state.participant.id}`
        );
        this.props.removeParticipant();
        this.props.history.push(this.props.basePath);
      } catch (error) {
        this.props.setNetworkError(error);
      }
    }
  };

  invalid = () => !this.state.participant.start_date;

  render() {
    const t = this.props.t;
    const participant = this.state.participant;

    return (
      <div>
        <EditActionBar
          can={this.props.can}
          editing={this.state.editing}
          saving={this.state.saving}
          save={this.save}
          saveDisabled={this.invalid() || !this.state.edited}
          cancel={() =>
            this.setState({
              editing: false,
              participant: deepcopy(this.props.participant)
            })
          }
          edit={() => this.setState({ editing: true })}
          delete={this.delete}
          t={t}
        />
        <h2>
          <Link className="notBlue" to={`/people/${participant.person.id}`}>
            {participant.person.full_name}
          </Link>
        </h2>
        <ParticipantRoles
          t={t}
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
                  t={t}
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
                    t={t}
                    allowBlank={true}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {this.props.language && !this.state.editing && (
          <div>
            <h3>{t("Activities")}</h3>
            <ul className={style.stdList}>
              {Participant.activitiesForParticipant(
                this.props.language,
                participant
              ).map(activity => (
                <li key={activity.id}>
                  <ProgressBar {...Activity.progress(activity)} small />
                  <Spacer width="10px" />
                  <Link to={`${this.props.basePath}/activities/${activity.id}`}>
                    {Activity.name(activity, t)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

ParticipantView.propTypes = {
  t: PropTypes.func.isRequired,
  participant: PropTypes.object.isRequired,
  can: PropTypes.object.isRequired,
  replaceParticipant: PropTypes.func.isRequired,
  setNetworkError: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  basePath: PropTypes.string.isRequired,
  removeParticipant: PropTypes.func.isRequired,
  language: PropTypes.object // If in a language context
};
