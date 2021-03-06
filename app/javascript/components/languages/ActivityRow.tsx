import React from "react";
import Activity, { IActivity, IStage } from "../../models/Activity";
import update from "immutability-helper";
import ProgressBar from "../shared/ProgressBar";
import NewStageForm from "./NewStageForm";
import styles from "./ActivitiesTable.css";
import Spacer from "../shared/Spacer";
import { Link } from "react-router-dom";
import { ICan } from "../../actions/canActions";
import I18nContext from "../../contexts/I18nContext";
import useLoad from "../shared/useLoad";

interface IProps {
  activity: IActivity;
  can: ICan;

  basePath: string;

  // added below
  saveLoad: ReturnType<typeof useLoad>[0];
}

export default function ActivityRow(props: Omit<IProps, "saveLoad">) {
  const [saveLoad] = useLoad();

  return <BaseActivityRow {...props} {...{ saveLoad }} />;
}

interface IState {
  expanded?: boolean;
  nextStage: IStage;
  updateFormState: "stage" | "saving" | "date" | "none";
}

class BaseActivityRow extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = this.freshState(props);
  }

  freshState = (props: IProps): IState => {
    return {
      expanded: false,
      nextStage: Activity.nextStage(props.activity),
      updateFormState: "stage"
    };
  };

  updateNextStage = (nextStage: Partial<IStage>) => {
    this.setState(prevState => ({
      nextStage: update(prevState.nextStage, { $merge: nextStage })
    }));
  };

  addNextStage = async () => {
    this.setState({ updateFormState: "saving" });
    const data = await this.props.saveLoad(duluAxios =>
      duluAxios.post("/api/stages", {
        stage: this.state.nextStage
      })
    );
    if (data) {
      this.setState(this.freshState(this.props));
    } else {
      this.setState({ updateFormState: "date" });
    }
  };

  render() {
    const activity = this.props.activity;
    return (
      <I18nContext.Consumer>
        {t => (
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
                <td colSpan={4} className={styles.rowExpansion}>
                  <div>
                    {
                      <NewStageForm
                        activity={this.props.activity}
                        formState={this.state.updateFormState}
                        stage={this.state.nextStage}
                        updateNextStage={this.updateNextStage}
                        setFormState={formState =>
                          this.setState({ updateFormState: formState })
                        }
                        save={this.addNextStage}
                        cancel={() =>
                          this.setState(this.freshState(this.props))
                        }
                      />
                    }
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        )}
      </I18nContext.Consumer>
    );
  }
}
