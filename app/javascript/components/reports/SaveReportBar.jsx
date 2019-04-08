import React from "react";
import PropTypes from "prop-types";
import TextInput from "../shared/TextInput";
import SaveButton from "../shared/SaveButton";
import DuluAxios from "../../util/DuluAxios";
import Report from "../../models/Report";
import { withRouter } from "react-router-dom";

class _SaveReportBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };
  }

  save = async () => {
    this.setState({ saving: true });
    const data = await DuluAxios.post("/api/reports", {
      report: {
        name: this.state.name,
        report: Report.params(this.props.report)
      }
    });
    if (data) {
      this.props.history.push(`/reports/${data.report.id}`);
    } else {
      this.setState({ saving: false });
    }
  };

  render() {
    const t = this.props.t;
    return (
      <div>
        <label>{t("Save_report")}</label>
        <TextInput
          value={this.state.name}
          name="name"
          placeholder={t("Report_name")}
          setValue={name => this.setState({ name })}
          autoFocus
        />
        <SaveButton
          handleClick={this.save}
          t={t}
          saveInProgress={this.state.saving}
          disabled={this.state.name.length == 0}
        />
        <button onClick={this.props.cancel} className="btnRed">
          {t("Cancel")}
        </button>
      </div>
    );
  }
}

const SaveReportBar = withRouter(_SaveReportBar);

_SaveReportBar.propTypes = {
  t: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  report: PropTypes.object.isRequired,

  history: PropTypes.object.isRequired // Supplied by withRouter()
};

export default SaveReportBar;
