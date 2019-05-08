import React from "react";
import TextInput from "../shared/TextInput";
import SaveButton from "../shared/SaveButton";
import DuluAxios from "../../util/DuluAxios";
import Report, { IReport } from "../../models/Report";
import { withRouter, RouteComponentProps } from "react-router-dom";
import I18nContext from "../../contexts/I18nContext";

interface IProps extends RouteComponentProps {
  report: IReport;
  cancel: () => void;
}

interface IState {
  name: string;
  saving?: boolean;
}

class _SaveReportBar extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
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
    return (
      <I18nContext.Consumer>
        {t => (
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
              onClick={this.save}
              saveInProgress={this.state.saving}
              disabled={this.state.name.length == 0}
            />
            <button onClick={this.props.cancel} className="btnRed">
              {t("Cancel")}
            </button>
          </div>
        )}
      </I18nContext.Consumer>
    );
  }
}

const SaveReportBar = withRouter(_SaveReportBar);

export default SaveReportBar;
