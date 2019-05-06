import React, { useContext } from "react";
import EditIcon from "./icons/EditIcon";
import DeleteIcon from "./icons/DeleteIcon";
import styles from "./EditActionBar.css";
import I18nContext from "../../application/I18nContext";
import { ICan } from "../../actions/canActions";

interface IProps {
  can: ICan;
  editing?: boolean;
  saving?: boolean;
  save?: () => void;
  saveDisabled?: boolean;
  cancel?: () => void;
  edit?: () => void;
  delete?: () => void;
}

export default function EditActionBar(props: IProps) {
  const t = useContext(I18nContext);

  if (!props.editing && !props.can) return null;

  return props.editing ? (
    <div className={styles.actionBar} data-div-name="editActionBar">
      <button
        onClick={props.save}
        disabled={props.saveDisabled || props.saving}
      >
        {props.saving ? t("Saving") : t("Save")}
      </button>
      <button className="btnRed" onClick={props.cancel}>
        {t("Cancel")}
      </button>
    </div>
  ) : (
    <div className={styles.actionBar} data-div-name="editActionBar">
      {props.can.update && <EditIcon iconSize="large" onClick={props.edit} />}
      {props.can.destroy && (
        <DeleteIcon iconSize="large" onClick={props.delete} />
      )}
    </div>
  );
}
