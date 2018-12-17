import React from "react";
import PropTypes from "prop-types";
import DaySelector from "./DaySelector";
import MonthSelector from "./MonthSelector";
import YearInput from "./YearInput";
import styles from "./FuzzyDateInput.css";

// Jan == 1
function daysInMonth(month) {
  if (month < 1 || month > 12) return 31;

  const days = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days[month];
}

function assembleDateString(year, month, day) {
  if (!year) return "";
  var s = zeroPad(year, 4);
  if (!month) return s;
  s += "-" + zeroPad(month, 2);
  if (!day) return s;
  s += "-" + zeroPad(day, 2);
  return s;
}

function zeroPad(number, digits) {
  var s = String(number);
  while (s.length < digits) {
    s = "0" + s;
  }
  return s;
}

export default class FuzzyDateInput extends React.PureComponent {
  constructor(props) {
    super(props);
    const date = props.date || "";
    const year = date.slice(0, 4);
    const errors = this.validationErrors(year);
    this.state = {
      year: year,
      month: parseInt(date.slice(5, 7)),
      day: parseInt(date.slice(8, 10)),
      errorMessage: errors,
      showErrors: year.length > 0
    };
  }

  componentDidMount() {
    if (this.state.errorMessage) {
      this.dateIsInvalid();
    }
  }

  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value }, this.pushDate);
  };

  clearDate = () => {
    this.setState({ year: "", day: "", month: "" }, this.pushDate);
  };

  dateIsInvalid = () => {
    if (this.props.dateIsInvalid) {
      this.props.dateIsInvalid();
    }
  };

  pushDate = () => {
    const errors = this.validationErrors();
    if (!errors) {
      this.props.handleDateInput(
        assembleDateString(this.state.year, this.state.month, this.state.day)
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

  validationErrors = year => {
    if (year === undefined) year = this.state.year;
    if (this.props.allowBlank && year.length == 0) {
      return null;
    }
    if (!parseInt(year)) {
      return this.props.t("Enter_valid_year");
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
      <div className={styles.fuzzyDate}>
        <DaySelector
          handleInput={this.handleInput}
          value={this.state.day}
          maxValue={daysInMonth(this.state.month)}
          t={this.props.t}
        />
        <MonthSelector
          handleInput={this.handleInput}
          value={this.state.month}
          t={this.props.t}
        />
        <YearInput
          handleInput={this.handleInput}
          value={this.state.year}
          t={this.props.t}
        />
        {this.props.allowBlank && this.props.date && (
          <button className="link" onClick={this.clearDate}>
            {this.props.t("Clear")}
          </button>
        )}
        <br />
        <span className={showErrors && styles.errorMessage}>
          {showErrors ? this.state.errorMessage : ""
          // this.props.t('Month_day_optional')
          }
        </span>
      </div>
    );
  }
}

FuzzyDateInput.propTypes = {
  date: PropTypes.string,
  handleDateInput: PropTypes.func.isRequired, // accepts date as str
  t: PropTypes.func.isRequired,
  allowBlank: PropTypes.bool,
  showErrors: PropTypes.bool,
  //optional
  dateIsInvalid: PropTypes.func
};
