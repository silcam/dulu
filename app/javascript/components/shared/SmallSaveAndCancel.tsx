import React, { useContext } from "react";
import I18nContext from "../../application/I18nContext";

interface IProps {
  handleSave: () => void;
  handleCancel: () => void;
  saveDisabled?: boolean;
  saveInProgress?: boolean;
  style?: { [rule: string]: any };
  saveCaption?: string;
}

export default function SmallSaveAndCancel(props: IProps) {
  const t = useContext(I18nContext);

  const style = props.style || {};
  const saveCaption = props.saveInProgress
    ? t("Saving")
    : props.saveCaption || t("Save");
  const saveDisabled = props.saveDisabled || props.saveInProgress;
  return (
    <div style={style}>
      <button
        onClick={props.handleSave}
        disabled={saveDisabled}
        style={{ fontSize: "11px" }}
      >
        {saveCaption}
      </button>
      <button
        onClick={props.handleCancel}
        className="btnRed"
        style={{ fontSize: "11px" }}
      >
        {t("Cancel")}
      </button>
    </div>
  );
}
