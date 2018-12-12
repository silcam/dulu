import React from "react";
import PropTypes from "prop-types";
import LCReport from "./LCReport";
import style from "./ReportsViewer.css";
import ReportSideBar from "./ReportSideBar";
import update from "immutability-helper";
import DuluAxios from "../../util/DuluAxios";
import Loading from "../shared/Loading";

export default class ReportsViewer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      report: blankReport(),
      loading: 0
    };
  }

  replaceReport = report => {
    this.setState({
      report: report
    });
  };

  updateElements = elements => {
    this.replaceReport(
      update(this.state.report, { elements: { $set: elements } })
    );
  };

  addLoading = () =>
    this.setState(prevState => ({ loading: prevState.loading + 1 }));

  subtractLoading = () =>
    this.setState(prevState => ({ loading: prevState.loading - 1 }));

  addProgram = async id => {
    this.addLoading();
    try {
      const data = await DuluAxios.get("/api/reports/report_data", {
        program_id: id,
        report_type: this.state.report.type
      });
      this.replaceReport(
        update(this.state.report, {
          programs: { $push: [data] }
        })
      );
    } catch (error) {
      this.props.setNetworkError(error);
    } finally {
      this.subtractLoading();
    }
  };

  addCluster = async id => {
    this.addLoading();
    try {
      const data = await DuluAxios.get("/api/reports/report_data", {
        cluster_id: id,
        report_type: this.state.report.type
      });
      this.replaceReport(
        update(this.state.report, {
          clusters: { $push: [data] }
        })
      );
    } catch (error) {
      this.props.setNetworkError(error);
    } finally {
      this.subtractLoading();
    }
  };

  dropProgram = id => {
    this.replaceReport(
      update(this.state.report, {
        programs: { $set: this.state.report.programs.filter(p => p.id != id) }
      })
    );
  };

  dropCluster = id => {
    this.replaceReport(
      update(this.state.report, {
        clusters: { $set: this.state.report.clusters.filter(c => c.id != id) }
      })
    );
  };

  // async componentDidMount() {
  //   try {
  //     const data = await DuluAxios.get("/api/reports/1");
  //     this.setState({
  //       report: data
  //     });
  //   } catch (error) {
  //     this.props.setNetworkError(error);
  //   }
  // }

  render() {
    return (
      <div className={style.container}>
        <div className={style.sidebar}>
          <ReportSideBar
            t={this.props.t}
            report={this.state.report}
            addProgram={this.addProgram}
            addCluster={this.addCluster}
            dropProgram={this.dropProgram}
            dropCluster={this.dropCluster}
            updateElements={this.updateElements}
          />
        </div>
        <div className={style.main}>
          {this.state.loading > 0 && <Loading t={this.props.t} />}
          <LCReport t={this.props.t} report={this.state.report} />
        </div>
      </div>
    );
  }
}

function blankReport() {
  return {
    type: "lc",
    elements: {
      activities: {
        Old_testament: true,
        New_testament: true
      },
      publications: {}
    },
    clusters: [],
    programs: []
  };
}

ReportsViewer.propTypes = {
  t: PropTypes.func.isRequired,
  setNetworkError: PropTypes.func.isRequired
};
