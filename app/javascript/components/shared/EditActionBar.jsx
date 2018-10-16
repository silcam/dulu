import React from "react";
import EditIcon from "../shared/icons/EditIcon";
import DeleteIcon from "../shared/icons/DeleteIcon";
import styles from "./EditActionBar.css";
import PropTypes from "prop-types";

export default function EditActionBar(props) {
  if (!props.can) return null;
  return props.editing ? (
    <div className={styles.actionBar}>
      <button onClick={props.save} disabled={props.saveDisabled && "disabled"}>
        {props.t("Save")}
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
  can: PropTypes.object,
  editing: PropTypes.bool,
  save: PropTypes.func,
  saveDisabled: PropTypes.bool,
  cancel: PropTypes.func,
  edit: PropTypes.func,
  delete: PropTypes.func
};
