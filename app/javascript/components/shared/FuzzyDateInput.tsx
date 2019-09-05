import React from "react";
import DaySelector from "./DaySelector";
import MonthSelector from "./MonthSelector";
import YearInput from "./YearInput";
import styles from "./FuzzyDateInput.css";
import I18nContext from "../../contexts/I18nContext";

export interface IProps {
  date?: string;
  handleDateInput: (date: string) => void;
  allowBlank?: boolean;
  showErrors?: boolean;
  //optional
  dateIsInvalid?: () => void;
  divId?: string;
}

interface IState {
  errorMessage: string | null;
  year: string;
  month: string;
  day: string;
  showErrors?: boolean;
}

// Jan == 1
function daysInMonth(month: number) {
  if (month < 1 || month > 12) return 31;

  const days = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days[month];
}

function assembleDateString(year?: number, month?: number, day?: number) {
  if (!year) return "";
  var s = zeroPad(year, 4);
  if (!month) return s;
  s += "-" + zeroPad(month, 2);
  if (!day) return s;
  s += "-" + zeroPad(day, 2);
  return s;
}

function zeroPad(number: number, digits: number) {
  var s = String(number);
  while (s.length < digits) {
    s = "0" + s;
  }
  return s;
}

export default class FuzzyDateInput extends React.PureComponent<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
    const date = props.date || "";
    const year = date.slice(0, 4);
    const errors = this.validationErrors(year);
    this.state = {
      year: year,
      month: date.slice(5, 7),
      day: date.slice(8, 10),
      errorMessage: errors,
      showErrors: year.length > 0
    };
  }

  componentDidMount() {
    if (this.state.errorMessage) {
      this.dateIsInvalid();
    }
  }

  clearDate = () => {
    this.setState({ year: "", day: "", month: "" }, this.pushDate);
  };

  dateIsInvalid = () => {
    if (this.props.dateIsInvalid) {
      this.props.dateIsInvalid();
    }
  };

  pushDate = () => {
    const errors = this.validationErrors(this.state.year);
    if (!errors) {
      this.props.handleDateInput(
        assembleDateString(
          parseInt(this.state.year),
          parseInt(this.state.month),
          parseInt(this.state.day)
        )
      );
      this.setState({
        errorMessage: null,
        showErrors: true
      });
    } else {
      this.setState({
        errorMessage: errors,
        showErrors: this.state.showErrors || this.state.year.length > 0
      });
      this.dateIsInvalid();
    }
  };

  validationErrors = (year: string) => {
    if (year === undefined) year = this.state.year;
    if (this.props.allowBlank && year.length == 0) {
      return null;
    }
    if (!parseInt(year)) {
      return "Enter_valid_year";
    }
    return null;
  };

  showErrors = () => {
    return (
      (this.state.showErrors || this.props.showErrors) &&
      this.state.errorMessage
    );
  };

  render() {
    var showErrors = this.showErrors();
    return (
      <I18nContext.Consumer>
        {t => (
          <div className={styles.fuzzyDate} id={this.props.divId || ""}>
            <DaySelector
              handleInput={day => this.setState({ day }, this.pushDate)}
              value={this.state.day}
              maxValue={daysInMonth(parseInt(this.state.month))}
            />
            <MonthSelector
              handleInput={month => this.setState({ month }, this.pushDate)}
              value={this.state.month}
            />
            <YearInput
              handleInput={year => this.setState({ year }, this.pushDate)}
              value={this.state.year}
            />
            {this.props.allowBlank && this.props.date && (
              <button className="link" onClick={this.clearDate}>
                {t("Clear")}
              </button>
            )}
            <br />
            <span className={styles.errorMessage}>
              {showErrors && this.state.errorMessage
                ? t(this.state.errorMessage)
                : ""
              // this.props.t('Month_day_optional')
              }
            </span>
          </div>
        )}
      </I18nContext.Consumer>
    );
  }
}
