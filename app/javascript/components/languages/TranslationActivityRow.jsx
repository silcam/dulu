import React from "react";
import PropTypes from "prop-types";
import ProgressBar from "../shared/ProgressBar";
import SelectInput from "../shared/SelectInput";
import Activity from "../../models/Activity";
import { itemAfter } from "../../util/arrayUtils";
import FuzzyDateInput from "../shared/FuzzyDateInput";
import update from "immutability-helper";
import FuzzyDate from "../../util/FuzzyDate";
import DuluAxios from "../../util/DuluAxios";
import NewStageForm from "./NewStageForm";
import BibleBook from "../../models/BibleBook";

export default class TranslationActivityRow extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = this.freshState(props);
  }

  freshState = props => {
    return {
      expanded: false,
      nextStage: {
        name: itemAfter(Activity.translationStages, props.activity.stage_name),
        start_date: FuzzyDate.today(),
        activity_id: props.activity.id
      },
      updateFormState:
        props.activity.stage_name == "Published" ? "none" : "stage"
    };
  };

  updateNextStage = nextStage => {
    this.setState(prevState => ({
      nextStage: update(prevState.nextStage, { $merge: nextStage })
    }));
  };

  addNextStage = async () => {
    this.setState({ updateFormState: "saving" });
    try {
      const data = await DuluAxios.post("/api/stages", {
        stage: this.state.nextStage
      });
      this.updateActivity({
        stage_name: data.stage.name,
        stage_date: data.stage.start_date,
        last_update: data.stage.last_update
      });
      this.setState({ updateFormState: "none" });
    } catch (error) {
      this.props.setNetworkError(error);
      this.setState({ updateFormState: "date" });
    }
  };

  updateActivity = mergeActivity => {
    const newActivity = update(this.props.activity, {
      $merge: mergeActivity
    });
    this.props.replaceActivity(newActivity);
  };

  render() {
    const activity = this.props.activity;
    const t = this.props.t;
    return this.state.expanded ? (
      <tr>
        <td colSpan="4">
          <button
            className="link"
            onClick={() => this.setState(this.freshState(this.props))}
          >
            {BibleBook.name(activity.bible_book_id, t)}
          </button>
          <div>
            <NewStageForm
              t={t}
              formState={this.state.updateFormState}
              stage={this.state.nextStage}
              updateNextStage={this.updateNextStage}
              setFormState={formState =>
                this.setState({ updateFormState: formState })
              }
              save={this.addNextStage}
            />
          </div>
        </td>
      </tr>
    ) : (
      <tr>
        <td>
          <button
            className="link"
            onClick={() => this.setState({ expanded: true })}
          >
            {BibleBook.name(activity.bible_book_id, t)}
          </button>
        </td>
        <td>
          <ProgressBar {...Activity.translationProgress[activity.stage_name]} />
        </td>
        <td>{t(`stage_names.${activity.stage_name}`)}</td>
        <td>{activity.stage_date}</td>
      </tr>
    );
  }
}

TranslationActivityRow.propTypes = {
  activity: PropTypes.object.isRequired
};
