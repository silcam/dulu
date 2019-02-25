import React from "react";
import PropTypes from "prop-types";
import Activity from "../../models/Activity";
import update from "immutability-helper";
import DuluAxios from "../../util/DuluAxios";
import ProgressBar from "../shared/ProgressBar";
import NewStageForm from "./NewStageForm";
import styles from "./ActivitiesTable.css";
import WorkshopActivity from "../workshops/WorkshopActivity";
import Spacer from "../shared/Spacer";
import { Link } from "react-router-dom";

export default class ActivityRow extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = this.freshState(props);
  }

  freshState = props => {
    return {
      expanded: false,
      nextStage: Activity.nextStage(props.activity),
      updateFormState: "stage"
    };
  };

  updateNextStage = nextStage => {
    this.setState(prevState => ({
      nextStage: update(prevState.nextStage, { $merge: nextStage })
    }));
  };

  addNextStage = async () => {
    this.setState({ updateFormState: "saving" });
    const data = await DuluAxios.post("/api/stages", {
      stage: this.state.nextStage
    });
    if (data) {
      this.props.setActivity({
        id: this.props.activity.id,
        stage_name: data.stage.name,
        stage_date: data.stage.start_date,
        last_update: data.stage.last_update
      });
      this.setState(this.freshState(this.props));
    } else {
      this.setState({ updateFormState: "date" });
    }
  };

  render() {
    const activity = this.props.activity;
    const t = this.props.t;
    return (
      <React.Fragment>
        <tr>
          <td>
            <Link to={`${this.props.basePath}/activities/${activity.id}`}>
              {Activity.name(activity, t)}
            </Link>
          </td>
          <td>
            <ProgressBar {...Activity.progress(activity)} />
            <Spacer width="20px" />
            {this.props.can.update_activities &&
            !Activity.isWorkshops(activity) ? (
              <button
                className="link"
                onClick={() =>
                  this.setState(prevState => ({
                    expanded: !prevState.expanded
                  }))
                }
              >
                {Activity.currentStageName(activity, t)}
              </button>
            ) : (
              Activity.currentStageName(activity, t)
            )}
          </td>
          <td>{Activity.stageDate(activity)}</td>
        </tr>
        {this.state.expanded && (
          <tr>
            <td colSpan="4" className={styles.rowExpansion}>
              <div>
                {
                  <NewStageForm
                    t={t}
                    activity={this.props.activity}
                    formState={this.state.updateFormState}
                    stage={this.state.nextStage}
                    updateNextStage={this.updateNextStage}
                    setFormState={formState =>
                      this.setState({ updateFormState: formState })
                    }
                    save={this.addNextStage}
                    cancel={() => this.setState(this.freshState(this.props))}
                  />
                }
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  }
}

ActivityRow.propTypes = {
  activity: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  can: PropTypes.object.isRequired,
  setActivity: PropTypes.func.isRequired,

  basePath: PropTypes.string.isRequired
};
