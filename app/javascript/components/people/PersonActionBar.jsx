import React from "react";
import EditIcon from "../shared/icons/EditIcon";
import DeleteIcon from "../shared/icons/DeleteIcon";

export default function PersonActionBar(props) {
  if (!props.can) return null;
  return props.editing ? (
    <div>
      <button onClick={props.save}>{props.t("Save")}</button>
      <button className="btnRed" onClick={props.cancel}>
        {props.t("Cancel")}
      </button>
    </div>
  ) : (
    <div>
      {props.can.update && <EditIcon iconSize="large" onClick={props.edit} />}
      {props.can.destroy && (
        <DeleteIcon iconSize="large" onClick={props.delete} />
      )}
    </div>
  );
}
