import React from "react";
import EditIcon from "../shared/icons/EditIcon";
import DeleteIcon from "../shared/icons/DeleteIcon";
import styles from "./EditActionBar.css";
import PropTypes from "prop-types";

export default function EditActionBar(props) {
  if (!props.can) return null;
  return props.editing ? (
    <div className={styles.actionBar}>
      <button
        onClick={props.save}
        disabled={(props.saveDisabled || props.saving) && "disabled"}
      >
        {props.saving ? props.t("Saving") : props.t("Save")}
      </button>
      <button className="btnRed" onClick={props.cancel}>
        {props.t("Cancel")}
      </button>
    </div>
  ) : (
    <div className={styles.actionBar}>
      {props.can.update && <EditIcon iconSize="large" onClick={props.edit} />}
      {props.can.destroy && (
        <DeleteIcon iconSize="large" onClick={props.delete} />
      )}
    </div>
  );
}

EditActionBar.propTypes = {
  can: PropTypes.object.isRequired,
  editing: PropTypes.bool,
  saving: PropTypes.bool,
  save: PropTypes.func.isRequired,
  saveDisabled: PropTypes.bool,
  cancel: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  delete: PropTypes.func, // Not required if not needed
  t: PropTypes.func.isRequired
};
