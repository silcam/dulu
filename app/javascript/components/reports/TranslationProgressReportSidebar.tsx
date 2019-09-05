import React, { useContext, useState } from "react";
import P from "../shared/P";
import DeleteIcon from "../shared/icons/DeleteIcon";
import Report, {
  TranslationProgressReport,
  IReportElements
} from "../../models/TranslationProgressReport";
import CheckBoxInput from "../shared/CheckboxInput";
import update from "immutability-helper";
import { SearchPickerAutoClear } from "../shared/SearchPicker";
import { connect } from "react-redux";
import I18nContext from "../../contexts/I18nContext";
import Cluster, { ICluster } from "../../models/Cluster";
import { ILanguage } from "../../models/Language";
import { AppState } from "../../reducers/appReducer";
import List from "../../models/List";
import DuluAxios from "../../util/DuluAxios";
import { ClusterMultiSelect } from "../shared/ModelMultiSelect";
import MultiSelectItemList from "../shared/MultiSelectItemList";

interface IProps {
  report: TranslationProgressReport;
  setReport: (r: TranslationProgressReport) => void;
  setLoading: (loading: boolean) => void;
  languages: List<ILanguage>;
  clusters: List<ICluster>;
}

function BaseSideBar(props: IProps) {
  const t = useContext(I18nContext);
  const report = props.report;
  const [loading, setLoading] = useState(0);

  const addLoading = () => {
    setLoading(loading + 1);
    props.setLoading(true);
  };

  const subtractLoading = () => {
    const newLoading = Math.max(0, loading - 1);
    setLoading(newLoading);
    if (newLoading == 0) props.setLoading(false);
  };

  const addLanguage = async (language: ILanguage) => {
    addLoading();
    const data = await DuluAxios.get("/api/reports/report_data", {
      language_id: language.id,
      report_type: report.type
    });
    if (data) {
      props.setReport(
        update(report, {
          languages: { $push: [data] }
        })
      );
    }
    subtractLoading();
  };

  const addCluster = async (cluster: ICluster) => {
    addLoading();
    const data = await DuluAxios.get("/api/reports/report_data", {
      cluster_id: cluster.id,
      report_type: report.type
    });
    if (data) {
      props.setReport(
        update(report, {
          clusters: { $push: [data] }
        })
      );
    }
    subtractLoading();
  };

  const dropLanguage = (id: number) => {
    props.setReport(
      update(report, {
        languages: { $set: report.languages.filter(p => p.id != id) }
      })
    );
  };
  const dropCluster = (id: number) => {
    props.setReport(
      update(report, {
        clusters: { $set: report.clusters.filter(c => c.id != id) }
      })
    );
  };

  const updateElements = (elements: IReportElements) => {
    props.setReport(update(report, { elements: { $set: elements } }));
  };

  return (
    <div style={{ maxWidth: "200px" }}>
      <P>
        <label>{t("Clusters")}</label>
        <SearchPickerAutoClear
          collection={props.clusters}
          setSelected={cluster => addCluster(cluster)}
          placeholder={t("Add_cluster")}
        />
        <MultiSelectItemList
          items={report.clusters}
          display={c => c.name}
          removeItem={c => dropCluster(c.id)}
          clear={() =>
            props.setReport(update(report, { clusters: { $set: [] } }))
          }
        />
      </P>
      <P>
        <label>{t("Languages")}</label>
        <SearchPickerAutoClear
          collection={props.languages}
          setSelected={lang => addLanguage(lang)}
          placeholder={t("Add_language")}
        />
        <MultiSelectItemList
          items={report.languages}
          display={lang => lang.name}
          removeItem={lang => dropLanguage(lang.id)}
          clear={() =>
            props.setReport(update(report, { languages: { $set: [] } }))
          }
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
                  updateElements(
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
                  updateElements(
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

const TranslationProgressReportSidebar = connect((state: AppState) => ({
  languages: state.languages,
  clusters: state.clusters
}))(BaseSideBar);

export default TranslationProgressReportSidebar;
