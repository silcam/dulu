import React from "react";
import PropTypes from "prop-types";
import EditActionBar from "../shared/EditActionBar";
import deepcopy from "../../util/deepcopy";
import DuluAxios from "../../util/DuluAxios";
import ParticipantRoles from "./ParticipantRoles";
import update from "immutability-helper";
import style from "./ParticipantView.css";
import TextOrFuzzyDateInput from "../shared/TextOrFuzzyDateInput";
import { Link } from "react-router-dom";
import Activity from "../../models/Activity";
import Spacer from "../shared/Spacer";
import ProgressBar from "../shared/ProgressBar";
import Loading from "../shared/Loading";
import { fullName } from "../../models/Person";

export default class ParticipantView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const data = await DuluAxios.get(`/api/participants/${this.props.id}`);
    if (data) {
      this.props.setPerson(data.person);
      data.language && this.props.setLanguage(data.language);
      data.cluster && this.props.setCluster(data.cluster);
      this.props.addParticipants([data.participant]);
      this.props.addActivities(data.activities);
    }
  }

  updateParticipant = mergeParticipant => {
    this.setState(prevState => ({
      participant: update(prevState.participant, { $merge: mergeParticipant }),
      edited: true
    }));
  };

  edit = () =>
    this.setState({
      participant: deepcopy(this.props.participant),
      editing: true
    });

  save = async () => {
    this.setState({ saving: true });
    const data = await DuluAxios.put(
      `/api/participants/${this.state.participant.id}`,
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

  delete = async () => {
    if (
      confirm(
        this.props.t("confirm_delete_participant", {
          person: fullName(this.props.person),
          language: this.props.clusterLanguage.name
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

  invalid = () => this.state.editing && !this.state.participant.start_date;

  render() {
    const t = this.props.t;
    const participant = this.state.editing
      ? this.state.participant
      : this.props.participant;

    if (!participant) return <Loading />;
    const can = this.props.participant.can || {};

    return (
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
              participant: deepcopy(this.props.participant)
            })
          }
          edit={this.edit}
          delete={this.delete}
          t={t}
        />
        <h2>
          <Link className="notBlue" to={`/people/${participant.person_id}`}>
            {fullName(this.props.person)}
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
          <div style={{ paddingTop: "20px" }}>
            <h3>{t("Activities")}</h3>
            <ul className={style.stdList}>
              {this.props.activities.map(activity => (
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
  participant: PropTypes.object,
  person: PropTypes.object,
  activities: PropTypes.array,
  clusterLanguage: PropTypes.object,

  history: PropTypes.object.isRequired,
  basePath: PropTypes.string.isRequired,
  setPerson: PropTypes.func.isRequired,
  addParticipants: PropTypes.func.isRequired,
  deleteParticipant: PropTypes.func.isRequired,
  addActivities: PropTypes.func.isRequired,
  setLanguage: PropTypes.func.isRequired,
  setCluster: PropTypes.func.isRequired,

  language: PropTypes.object // If in a language context
};
