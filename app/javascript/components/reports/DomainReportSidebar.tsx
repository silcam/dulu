import React, { useEffect, useContext } from "react";
import DuluAxios from "../../util/DuluAxios";
import FormGroup from "../shared/FormGroup";
import SelectInput from "../shared/SelectInput";
import I18nContext from "../../contexts/I18nContext";
import PeriodInput from "../shared/PeriodInput";
import Language, { ILanguage } from "../../models/Language";
import List from "../../models/List";
import { connect } from "react-redux";
import { AppState } from "../../reducers/appReducer";
import {
  LanguageMultiSelect,
  ClusterMultiSelect
} from "../shared/ModelMultiSelect";
import Cluster, { ICluster } from "../../models/Cluster";
import { Partial } from "../../models/TypeBucket";
import update from "immutability-helper";
import { DomainReport, DRDataParams } from "../../models/DomainReport";
import { Domain } from "../../models/Domain";
import useViewPrefs from "../../reducers/useViewPrefs";

interface IProps {
  report: DomainReport;
  setReport: (r: DomainReport) => void;
  languages: List<ILanguage>;
  clusters: List<ICluster>;
}

const REPORT_DOMAINS = ["Literacy", "Linguistics", "Translation"];

function BaseSidebar(props: IProps) {
  const t = useContext(I18nContext);
  const report = props.report;
  const reportParams = props.report.dataParams;
  const { setViewPrefs } = useViewPrefs();

  const updateReportParams = (params: Partial<DRDataParams>) => {
    const dataParams = update(report.dataParams, { $merge: params });
    setViewPrefs({ domainReportParams: dataParams });
    props.setReport(update(report, { $merge: { dataParams } }));
  };

  let selectedLanguages = Language.emptyList();
  if (reportParams.languageIds)
    selectedLanguages = selectedLanguages.add(
      reportParams.languageIds.map(id => props.languages.get(id))
    );

  let selectedClusters = Cluster.emptyList();
  if (reportParams.clusterIds)
    selectedClusters = selectedClusters.add(
      reportParams.clusterIds.map(id => props.clusters.get(id))
    );

  useEffect(() => {
    DuluAxios.get("/api/reports/domain_report", reportParams).then(data => {
      if (data) props.setReport(data.report as DomainReport);
    });
  }, [JSON.stringify(reportParams)]);

  return (
    <div style={{ padding: "18px" }}>
      <FormGroup label="Domain">
        <SelectInput
          value={reportParams.domain}
          setValue={domain => updateReportParams({ domain: domain as Domain })}
          options={SelectInput.translatedOptions(REPORT_DOMAINS, t, "domains")}
        />
      </FormGroup>
      <PeriodInput
        period={reportParams.period}
        setPeriod={period => updateReportParams({ period })}
      />
      <div id="languageSelect">
        <LanguageMultiSelect
          allItems={props.languages}
          selectedItems={selectedLanguages}
          setSelectedItems={selectedLanguages =>
            updateReportParams({
              languageIds: selectedLanguages.map(lang => lang.id)
            })
          }
        />
      </div>
      <div id="clusterSelect">
        <ClusterMultiSelect
          allItems={props.clusters}
          selectedItems={selectedClusters}
          setSelectedItems={selectedClusters =>
            updateReportParams({
              clusterIds: selectedClusters.map(cluster => cluster.id)
            })
          }
        />
      </div>
    </div>
  );
}

const DomainReportSidebar = connect((state: AppState) => ({
  languages: state.languages,
  clusters: state.clusters
}))(BaseSidebar);

export default DomainReportSidebar;
