import React from "react";
import Loading from "../shared/Loading";
import styles from "../shared/MasterDetail.css";
import { withRouter, RouteComponentProps } from "react-router-dom";
import List from "../../models/List";
import { ILanguage } from "../../models/Language";

export default withRouter(LanguagesTable);

interface IProps extends RouteComponentProps {
  languages: List<ILanguage>;
  id?: number;
}

function LanguagesTable(props: IProps) {
  if (props.languages.length() == 0) {
    return <Loading />;
  }

  return (
    <div>
      <table>
        <tbody>
          {props.languages.map(language => (
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
