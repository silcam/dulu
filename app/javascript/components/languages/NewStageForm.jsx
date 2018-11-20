import React from "react";
import PropTypes from "prop-types";
import SelectInput from "../shared/SelectInput";
import Activity from "../../models/Activity";
import FuzzyDateInput from "../shared/FuzzyDateInput";

export default function NewStageForm(props) {
  const t = props.t;

  switch (props.formState) {
    case "stage":
      return (
        <div>
          <label>{t("Update_to")}</label>
          <SelectInput
            handleChange={e => props.updateNextStage({ name: e.target.value })}
            value={props.stage.name}
            options={Activity.translationStages.map(stage => ({
              value: stage,
              display: t(`stage_names.${stage}`)
            }))}
          />
          <button onClick={() => props.setFormState("date")}>
            {t("Update")}
          </button>
        </div>
      );
    case "date":
      return (
        <div>
          <label>{t("As_of")}</label>
          <FuzzyDateInput
            date={props.stage.start_date}
            handleDateInput={date =>
              props.updateNextStage({
                start_date: date,
                invalidDate: false
              })
            }
            dateIsInvalid={() => props.updateNextStage({ invalidDate: true })}
            t={t}
          />
          <button
            onClick={props.save}
            disabled={props.stage.invalidDate ? "disabled" : false}
          >
            {t("Save")}
          </button>
        </div>
      );
    case "saving":
      return t("Saving");
    case "none":
    default:
      return null;
  }
}

NewStageForm.propTypes = {
  t: PropTypes.func.isRequired,
  formState: PropTypes.string.isRequired,
  stage: PropTypes.object.isRequired,
  updateNextStage: PropTypes.func.isRequired,
  setFormState: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired
};
