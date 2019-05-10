import React, { useContext } from "react";
import { fullName, IPerson } from "../../models/Person";
import styles from "../shared/Callout.css";
import I18nContext from "../../contexts/I18nContext";

interface IProps {
  duplicatePerson: IPerson;
  not_a_duplicate?: boolean;
  handleCheck: (value: boolean) => void;
}

function DuplicateWarning(props: IProps) {
  const duplicatePerson = props.duplicatePerson;
  const t = useContext(I18nContext);
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
          onChange={e => props.handleCheck(e.target.checked)}
        />
        &nbsp;
        {t("confirm_different_person")}
      </label>
    </div>
  );
}

export default DuplicateWarning;
