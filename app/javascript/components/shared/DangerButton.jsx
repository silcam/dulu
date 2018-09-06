import React from "react";

/*
    Required props:
        handleClick()
        message
        buttonText
        strings
*/

class DangerButton extends React.PureComponent {
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
      <div className="bs-callout callout-red dangerButton">
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
          className="btn btn-danger"
          onClick={this.props.handleClick}
          disabled={!this.state.userIsSure}
        >
          {this.props.buttonText}
        </button>
        &nbsp;
        <button className="btn btn-primary" onClick={this.props.handleCancel}>
          {this.props.t("Cancel")}
        </button>
      </div>
    );
  }
}

export default DangerButton;
