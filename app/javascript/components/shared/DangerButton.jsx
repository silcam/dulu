import React from "react";
import PropTypes from "prop-types";
import styles from "./Callout.css";

export default class DangerButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { userIsSure: false };
  }

  checkboxClick = e => {
    this.setState({
      userIsSure: e.target.checked
    });
  };

  render() {
    return (
      <div className={styles.calloutRed}>
        <h4>{this.props.message}</h4>
        <label style={{ display: "block" }}>
          <input
            type="checkbox"
            name="dangerButtonCheckbox"
            onChange={this.checkboxClick}
            checked={this.state.userIsSure}
          />
          &nbsp;
          {this.props.t("Im_sure")}
        </label>
        <button
          className="btnRed"
          onClick={this.props.handleClick}
          disabled={!this.state.userIsSure}
        >
          {this.props.buttonText}
        </button>
        &nbsp;
        <button onClick={this.props.handleCancel}>
          {this.props.t("Cancel")}
        </button>
      </div>
    );
  }
}

DangerButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
};
