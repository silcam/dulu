import React, { useContext } from "react";
import EditIcon from "../shared/icons/EditIcon";
import DeleteIcon from "../shared/icons/DeleteIcon";
import styles from "./EditActionBar.css";
import PropTypes from "prop-types";
import I18nContext from "../../application/I18nContext";

export default function EditActionBar(props) {
  const t = useContext(I18nContext);

  if (!props.editing && !props.can) return null;

  return props.editing ? (
    <div className={styles.actionBar} data-div-name="editActionBar">
      <button
        onClick={props.save}
        disabled={(props.saveDisabled || props.saving) && "disabled"}
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

EditActionBar.propTypes = {
  can: PropTypes.object,
  editing: PropTypes.bool,
  saving: PropTypes.bool,
  save: PropTypes.func,
  saveDisabled: PropTypes.bool,
  cancel: PropTypes.func,
  edit: PropTypes.func,
  delete: PropTypes.func // Not required if not needed
};
