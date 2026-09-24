import React from "react";
import { IReport, reportParams } from "../../models/Report";
import TextInput from "../shared/TextInput";
import SaveButton from "../shared/SaveButton";
import DuluAxios from "../../util/DuluAxios";
import { useNavigate, NavigateFunction } from "react-router-dom";
import I18nContext from "../../contexts/I18nContext";
import FormGroup from "../shared/FormGroup";

interface IOwnProps {
  report: IReport;
  cancel: () => void;
}

interface IProps extends IOwnProps {
  navigate: NavigateFunction;
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
        report: reportParams(this.props.report)
      }
    });
    if (data) {
      this.props.navigate(`/reports/${data.report.id}`);
    } else {
      this.setState({ saving: false });
    }
  };

  render() {
    return (
      <I18nContext.Consumer>
        {t => (
          <div>
            <FormGroup label={t("Save_report")}>
              <TextInput
                value={this.state.name}
                name="name"
                placeholder={t("Report_name")}
                setValue={name => this.setState({ name })}
                autoFocus
              />
            </FormGroup>
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

// The one class component that took its router props from withRouter, which
// React Router 6 removes. Hooks cannot be called in a class, so the history
// comes in as an ordinary prop from a function wrapper -- the same shape
// MainRouter already uses for BaseMainRouter.
export default function SaveReportBar(props: IOwnProps) {
  const navigate = useNavigate();

  return <_SaveReportBar {...props} navigate={navigate} />;
}
