import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import DuluAxios from "../../util/DuluAxios";
import style from "./ReportsViewer.css";

export default class SavedReports extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { expanded: false };
  }

  async componentDidMount() {
    if (!this.props.savedReports) {
      try {
        const data = await DuluAxios.get("/api/reports");
        this.props.setSavedReports(data.reports);
      } catch (error) {
        this.props.setNetworkError(error);
      }
    }
  }

  render() {
    if (!this.props.savedReports || this.props.savedReports.length == 0)
      return null;

    const t = this.props.t;
    const reports = this.state.expanded
      ? this.props.savedReports
      : this.props.savedReports.slice(0, 5);
    return (
      <div>
        <h2>{t("Saved_reports")}</h2>
        <div className={style.savedReportsList}>
          <ul>
            {reports.map(report => (
              <li key={report.id}>
                <h4>
                  <Link to={`/reports/${report.id}`}>{report.name}</Link>
                </h4>
              </li>
            ))}
          </ul>
          {!this.state.expanded && this.props.savedReports.length > 5 && (
            <button
              className="link"
              onClick={() => this.setState({ expanded: true })}
            >
              {t("See_all")}
            </button>
          )}
        </div>
      </div>
    );
  }
}

SavedReports.propTypes = {
  t: PropTypes.func.isRequired,
  savedReports: PropTypes.array,
  setSavedReports: PropTypes.func.isRequired,
  setNetworkError: PropTypes.func.isRequired
};
