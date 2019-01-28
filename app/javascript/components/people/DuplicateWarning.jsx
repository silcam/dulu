import React from "react";
import { fullName } from "../../models/person";
import styles from "../shared/Callout.css";

function DuplicateWarning(props) {
  const duplicatePerson = props.duplicatePerson;
  const t = props.t;
  return (
    <div className={styles.calloutRed} style={{ marginBottom: "12px" }}>
      <h4>{`${fullName(duplicatePerson)} ${t("already_exists")}`}</h4>
      <p>
        {t("duplicate_warning_start")}
        &nbsp;
        <a
          href={`/people/show/${duplicatePerson.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {fullName(duplicatePerson)}
        </a>
        &nbsp;
        {t("duplicate_warning_end")}
      </p>
      <label>
        <input
          type="checkbox"
          name="not_a_duplicate"
          checked={props.not_a_duplicate || false}
          onChange={props.handleCheck}
        />
        &nbsp;
        {t("confirm_different_person")}
      </label>
    </div>
  );
}

export default DuplicateWarning;
