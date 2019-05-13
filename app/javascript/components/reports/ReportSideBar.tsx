import React, { useContext } from "react";
import P from "../shared/P";
import DeleteIcon from "../shared/icons/DeleteIcon";
import Report, { IReport, IReportElements } from "../../models/Report";
import CheckBoxInput from "../shared/CheckboxInput";
import update from "immutability-helper";
import { SearchPickerAutoClear } from "../shared/SearchPicker";
import { connect } from "react-redux";
import I18nContext from "../../contexts/I18nContext";
import { ICluster } from "../../models/Cluster";
import { ILanguage } from "../../models/Language";
import { AppState } from "../../reducers/appReducer";
import List from "../../models/List";

interface IProps {
  report: IReport;
  addCluster: (c: ICluster) => void;
  addLanguage: (l: ILanguage) => void;
  dropCluster: (id: number) => void;
  dropLanguage: (id: number) => void;
  updateElements: (elements: IReportElements) => void;
  save: () => void;
  clusters: List<ICluster>;
  languages: List<ILanguage>;
}

function BaseReportSideBar(props: IProps) {
  const t = useContext(I18nContext);
  const report = props.report;

  return (
    <div>
      <h3>{t("Report_options")}</h3>
      {showSaveButton(report) && (
        <button onClick={props.save}>{t("Save")}</button>
      )}
      <P>
        <label>{t("Clusters")}</label>
        <ul>
          {report.clusters.map(cluster => (
            <li key={cluster.id}>
              - {cluster.name}
              <DeleteIcon
                onClick={() => props.dropCluster(cluster.id)}
                iconSize="small"
              />
            </li>
          ))}
        </ul>
        <SearchPickerAutoClear
          collection={props.clusters}
          setSelected={cluster => props.addCluster(cluster)}
          placeholder={t("Add_cluster")}
        />
      </P>
      <P>
        <label>{t("Languages")}</label>
        <ul>
          {report.languages.map(language => (
            <li key={language.id}>
              - {language.name}
              <DeleteIcon
                onClick={() => props.dropLanguage(language.id)}
                iconSize="small"
              />
            </li>
          ))}
        </ul>
        <SearchPickerAutoClear
          collection={props.languages}
          setSelected={lang => props.addLanguage(lang)}
          placeholder={t("Add_language")}
        />
      </P>
      <P>
        <label>{t("domains.Translation")}</label>
        <ul>
          {Report.LanguageComparison.elements.activities.map(testament => (
            <li key={testament}>
              <CheckBoxInput
                text={t(testament)}
                value={!!report.elements.activities[testament]}
                setValue={checked =>
                  props.updateElements(
                    update(report.elements, {
                      activities: { [testament]: { $set: checked } }
                    })
                  )
                }
              />
            </li>
          ))}
        </ul>
      </P>
      <P>
        <label>{t("Publications")}</label>
        <ul>
          {Report.LanguageComparison.elements.publications.map(pub => (
            <li key={pub}>
              <CheckBoxInput
                text={Report.tPubName(pub, t)}
                value={report.elements.publications[pub] || false}
                setValue={checked =>
                  props.updateElements(
                    update(report.elements, {
                      publications: { [pub]: { $set: checked } }
                    })
                  )
                }
              />
            </li>
          ))}
        </ul>
      </P>
    </div>
  );
}

function showSaveButton(report: IReport) {
  return (
    (report.clusters.length > 0 || report.languages.length > 0) &&
    (Object.keys(report.elements.activities).some(
      testament => !!report.elements.activities[testament]
    ) ||
      Object.keys(report.elements.publications).some(
        pub => report.elements.publications[pub]
      ))
  );
}

const ReportSideBar = connect((state: AppState) => ({
  languages: state.languages,
  clusters: state.clusters
}))(BaseReportSideBar);

export default ReportSideBar;
