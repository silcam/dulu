import React from "react";
import PropTypes from "prop-types";
import ProgressBarTranslation from "../shared/ProgressBarTranslation";
import { Link } from "react-router-dom";

export default function ClusterLanguagesTable(props) {
  const cluster = props.cluster;
  const t = props.t;

  return (
    <div>
      <h3>{t("Languages")}</h3>
      <table>
        <tbody>
          <tr>
            <th />
            <th>{t("Old_testament")}</th>
            <th>{t("New_testament")}</th>
          </tr>
          {cluster.languages.map(language => (
            <tr key={language.id}>
              <td>
                <Link to={`/languages/${language.program_id}`}>
                  {language.name}
                </Link>
              </td>
              <td>
                {language.progress.Old_testament && (
                  <ProgressBarTranslation
                    progress={language.progress.Old_testament}
                    t={t}
                  />
                )}
              </td>
              <td>
                {language.progress.New_testament && (
                  <ProgressBarTranslation
                    progress={language.progress.New_testament}
                    t={t}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

ClusterLanguagesTable.propTypes = {
  cluster: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};
