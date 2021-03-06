import React, { useContext } from "react";
import ProgressBarTranslation from "../shared/ProgressBarTranslation";
import { Link } from "react-router-dom";
import DeleteIcon from "../shared/icons/DeleteIcon";
import InlineAddIcon from "../shared/icons/InlineAddIcon";
import { IClusterInflated } from "../../models/Cluster";
import { UpdaterFunc } from "../../models/TypeBucket";
import I18nContext from "../../contexts/I18nContext";
import { ILanguage } from "../../models/Language";
import SearchPicker from "../shared/SearchPicker";
import useAppSelector from "../../reducers/useAppSelector";

interface IProps {
  cluster: IClusterInflated;
  editing?: boolean;
  edit: () => void;
  updateCluster: UpdaterFunc;
}

export default function ClusterLanguagesTable(props: IProps) {
  const cluster = props.cluster;
  const t = useContext(I18nContext);

  const languages = useAppSelector(state => state.languages);

  const addLanguage = (language: ILanguage) => {
    props.updateCluster({
      languages: props.cluster.languages.add([language])
    });
  };

  const removeLanguage = (id: number) => {
    props.updateCluster({
      languages: props.cluster.languages.remove(id)
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
                <SearchPicker
                  collection={languages}
                  selectedId={null}
                  setSelected={language => language && addLanguage(language)}
                  placeholder={t("Add_language")}
                  autoClear
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
            {cluster.languages.length() > 0 && (
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
                    />
                  )}
                </td>
                <td>
                  {language.progress.New_testament && (
                    <ProgressBarTranslation
                      progress={language.progress.New_testament}
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
