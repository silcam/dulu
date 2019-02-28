import React from "react";
import Loading from "../shared/Loading";
import styles from "../shared/MasterDetail.css";
import { withRouter } from "react-router-dom";

export default withRouter(LanguagesTable);

function LanguagesTable(props) {
  const filter = new RegExp(props.filter, "i");
  const languages = props.languages.filter(language =>
    language.name.match(filter)
  );
  if (props.languages.length == 0) {
    return <Loading />;
  }
  if (languages.length == 0) {
    return <p>{props.t("NoneFound")}</p>;
  }
  return (
    <div>
      <table>
        <tbody>
          {languages.map(language => (
            <tr
              key={language.id}
              className={language.id == props.id ? styles.selected : undefined}
              onClick={() => props.history.push(`/languages/${language.id}`)}
            >
              <td>{language.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
