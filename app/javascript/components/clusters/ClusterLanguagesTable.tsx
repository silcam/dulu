import React from "react";
import ProgressBarTranslation from "../shared/ProgressBarTranslation";
import { Link } from "react-router-dom";
import DeleteIcon from "../shared/icons/DeleteIcon";
import { deleteFrom } from "../../util/arrayUtils";
import SearchTextInput from "../shared/SearchTextInput";
import InlineAddIcon from "../shared/icons/InlineAddIcon";
import { IClusterInflated } from "../../models/Cluster";
import { T } from "../../i18n/i18n";
import { BasicModel } from "../../models/BasicModel";
import { UpdaterFunc } from "../../models/TypeBucket";

interface IProps {
  cluster: IClusterInflated;
  t: T;
  editing?: boolean;
  edit: () => void;
  updateCluster: UpdaterFunc;
}

export default function ClusterLanguagesTable(props: IProps) {
  const cluster = props.cluster;
  const t = props.t;

  const addLanguage = (language: BasicModel) => {
    props.updateCluster({
      languages: [language].concat(props.cluster.languages)
    });
  };

  const removeLanguage = (id: number) => {
    props.updateCluster({
      languages: deleteFrom(props.cluster.languages, id)
    });
  };

  return (
    <div>
      <h3>
        {t("Languages")}
        {!props.editing && cluster.can.update && (
          <InlineAddIcon onClick={props.edit} />
        )}
      </h3>
      {props.editing ? (
        <table>
          <tbody>
            <tr>
              <td colSpan={2}>
                <SearchTextInput
                  queryPath="/api/languages/search"
                  text=""
                  updateValue={(language: BasicModel) => addLanguage(language)}
                  placeholder={t("Add_language")}
                  addBox
                />
              </td>
            </tr>

            {cluster.languages.map(language => (
              <tr key={language.id}>
                <td>{language.name}</td>
                <td>
                  <DeleteIcon onClick={() => removeLanguage(language.id)} />{" "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table>
          <tbody>
            {cluster.languages.length > 0 && (
              <tr>
                <th />
                <th>{t("Old_testament")}</th>
                <th>{t("New_testament")}</th>
              </tr>
            )}
            {cluster.languages.map(language => (
              <tr key={language.id}>
                <td>
                  <Link to={`/languages/${language.id}`}>{language.name}</Link>
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
      )}
    </div>
  );
}
