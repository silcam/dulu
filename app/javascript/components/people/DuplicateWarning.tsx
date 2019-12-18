import React, { useContext } from "react";
import { fullName } from "../../models/Person";
import styles from "../shared/Callout.css";
import I18nContext from "../../contexts/I18nContext";

export interface Duplicate {
  id: number;
  full_name: string;
  email: string;
  country: string;
  organizations: { id: number; name: string }[];
}

interface NewPerson {
  first_name: string;
  last_name: string;
  not_a_duplicate?: boolean;
}

interface IProps<T extends NewPerson> {
  duplicates: Duplicate[];
  newPerson: T;
  setNewPerson: (np: T) => void;
}

export default function DuplicateWarning<T extends NewPerson>(
  props: IProps<T>
) {
  const t = useContext(I18nContext);
  return (
    <div className={styles.calloutRed} style={{ marginBottom: "12px" }}>
      <h4>{t("may_already_exist", { name: fullName(props.newPerson) })}</h4>
      <p>{t("duplicate_warning_text")}</p>
      <div style={{ padding: "0 0 8px 8px" }}>
        <ul>
          {props.duplicates.map(duplicate => (
            <li key={duplicate.id}>
              <i>{duplicate.full_name} </i>
              {duplicate.email && `[${duplicate.email}] `}
              {[duplicate.country, ...duplicate.organizations.map(o => o.name)]
                .filter(s => s)
                .join(", ")}
            </li>
          ))}
        </ul>
      </div>
      <label>
        <input
          type="checkbox"
          name="not_a_duplicate"
          checked={props.newPerson.not_a_duplicate || false}
          onChange={e =>
            props.setNewPerson({
              ...props.newPerson,
              not_a_duplicate: e.target.checked
            })
          }
        />
        &nbsp;
        {t("confirm_different_person")}
      </label>
    </div>
  );
}
