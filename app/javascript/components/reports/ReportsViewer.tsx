import React from "react";
import LCReport from "./LCReport";
import style from "./ReportsViewer.css";
import ReportSideBar from "./ReportSideBar";
import update from "immutability-helper";
import DuluAxios from "../../util/DuluAxios";
import Loading from "../shared/Loading";
import SaveReportBar from "./SaveReportBar";
import EditActionBar from "../shared/EditActionBar";
import Report, { IReport, IReportElements } from "../../models/Report";
import SavedReports, { ISavedReport } from "./SavedReports";
import { RouteComponentProps } from "react-router";
import { ILanguage } from "../../models/Language";
import { ICluster } from "../../models/Cluster";

interface IProps extends RouteComponentProps {
  id?: number;
}

interface IState {
  report: IReport;
  loading: number;
  saving?: boolean;
  savedReports?: ISavedReport[];
}

export default class ReportsViewer extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      report: props.location.state
        ? props.location.state.report
        : blankReport(),
      loading: 0
    };
  }

  async componentDidMount() {
    if (this.props.id) {
      const data = await DuluAxios.get(`/api/reports/${this.props.id}`);
      if (data) {
        this.setState({ report: data.report });
      }
    }
  }

  replaceReport = (report: IReport) => {
    this.setState({
      report: report
    });
  };

  updateElements = (elements: IReportElements) => {
    this.replaceReport(
      update(this.state.report, { elements: { $set: elements } })
    );
  };

  addLoading = () =>
    this.setState(prevState => ({ loading: prevState.loading + 1 }));

  subtractLoading = () =>
    this.setState(prevState => ({ loading: prevState.loading - 1 }));

  addLanguage = async (language: ILanguage) => {
    this.addLoading();
    const data = await DuluAxios.get("/api/reports/report_data", {
      language_id: language.id,
      report_type: this.state.report.type
    });
    if (data) {
      this.replaceReport(
        update(this.state.report, {
          languages: { $push: [data] }
        })
      );
    }
    this.subtractLoading();
  };

  addCluster = async (cluster: ICluster) => {
    this.addLoading();
    const data = await DuluAxios.get("/api/reports/report_data", {
      cluster_id: cluster.id,
      report_type: this.state.report.type
    });
    if (data) {
      this.replaceReport(
        update(this.state.report, {
          clusters: { $push: [data] }
        })
      );
    }
    this.subtractLoading();
  };

  dropLanguage = (id: number) => {
    this.replaceReport(
      update(this.state.report, {
        languages: { $set: this.state.report.languages.filter(p => p.id != id) }
      })
    );
  };

  dropCluster = (id: number) => {
    this.replaceReport(
      update(this.state.report, {
        clusters: { $set: this.state.report.clusters.filter(c => c.id != id) }
      })
    );
  };

  render() {
    return (
      <div className={style.container}>
        <div className={style.sidebar}>
          {!this.props.id && !this.state.saving && (
            <ReportSideBar
              report={this.state.report}
              addLanguage={this.addLanguage}
              addCluster={this.addCluster}
              dropLanguage={this.dropLanguage}
              dropCluster={this.dropCluster}
              updateElements={this.updateElements}
              save={() => this.setState({ saving: true })}
            />
          )}
        </div>
        <div className={style.main}>
          {this.state.saving && (
            <SaveReportBar
              report={this.state.report}
              cancel={() => this.setState({ saving: false })}
            />
          )}
          {this.state.loading > 0 && <Loading />}
          {this.props.id && (
            <EditActionBar
              can={{ update: true }}
              edit={() =>
                this.props.history.push("/reports", {
                  report: Report.copy(this.state.report)
                })
              }
            />
          )}
          {this.state.report.clusters.length +
            this.state.report.languages.length >
          0 ? (
            <LCReport report={this.state.report} />
          ) : (
            <SavedReports
              savedReports={this.state.savedReports}
              setSavedReports={reports =>
                this.setState({ savedReports: reports })
              }
            />
          )}
        </div>
      </div>
    );
  }
}

function blankReport() {
  return {
    type: "LanguageComparison",
    elements: {
      activities: {
        Old_testament: true,
        New_testament: true
      },
      publications: {}
    },
    clusters: [],
    languages: []
  };
}
