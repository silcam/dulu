import React from "react";
import PropTypes from "prop-types";
import SelectInput from "../shared/SelectInput";
import Activity from "../../models/Activity";
import FuzzyDateInput from "../shared/FuzzyDateInput";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import styles from "./ActivitiesTable.css";

export default function NewStageForm(props) {
  const t = props.t;

  switch (props.formState) {
    case "stage":
      return (
        <div className={styles.rowExpansion}>
          <label>{t("Update_stage")}</label>
          <SelectInput
            handleChange={e => props.updateNextStage({ name: e.target.value })}
            value={props.stage.name}
            options={SelectInput.translatedOptions(
              Activity.stages(props.activity),
              t,
              "stage_names"
            )}
          />
          <button className="small" onClick={() => props.setFormState("date")}>
            {t("Update")}
          </button>
          <button className="small btnRed" onClick={props.cancel}>
            {t("Cancel")}
          </button>
        </div>
      );
    case "date":
      return (
        <div className={styles.rowExpansion}>
          <label>{t("As_of")}</label>
          <div className={styles.inline}>
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
          </div>
          <div className={styles.inline}>
            <SmallSaveAndCancel
              handleSave={props.save}
              handleCancel={props.cancel}
              t={t}
              saveDisabled={props.stage.invalidDate}
            />
          </div>
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
  activity: PropTypes.object.isRequired,
  formState: PropTypes.string.isRequired,
  stage: PropTypes.object.isRequired,
  updateNextStage: PropTypes.func.isRequired,
  setFormState: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired
};
