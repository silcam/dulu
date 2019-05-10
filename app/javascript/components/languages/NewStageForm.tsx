import React, { useContext } from "react";
import SelectInput from "../shared/SelectInput";
import Activity, { IActivity, IStage } from "../../models/Activity";
import FuzzyDateInput from "../shared/FuzzyDateInput";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import styles from "./ActivitiesTable.css";
import I18nContext from "../../contexts/I18nContext";

type FormState = "stage" | "date" | "saving" | "none";

interface IProps {
  activity: IActivity;
  formState: FormState;
  stage: IStage;
  updateNextStage: (s: Partial<IStage>) => void;
  setFormState: (formState: FormState) => void;
  save: () => void;
  cancel: () => void;
}

export default function NewStageForm(props: IProps) {
  const t = useContext(I18nContext);
  switch (props.formState) {
    case "stage":
      return (
        <div className={styles.rowExpansion}>
          <label>{t("Update_stage")}</label>
          <SelectInput
            setValue={name => props.updateNextStage({ name })}
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
            />
          </div>
          <div className={styles.inline}>
            <SmallSaveAndCancel
              handleSave={props.save}
              handleCancel={props.cancel}
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
