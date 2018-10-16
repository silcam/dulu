import React from "react";
import PropTypes from "prop-types";
import AlertBox from "./AlertBox";

export default function NetworkErrorAlert(props) {
  return (
    <AlertBox styleClass="alertBoxRed">
      <span style={{ textAlign: "center" }}>
        {props.t("network_error_message")}
        &nbsp;
        {props.tryAgain && (
          <button className="link" onClick={props.tryAgain}>
            {props.t("Try_again")}
          </button>
        )}
      </span>
    </AlertBox>
  );
}

NetworkErrorAlert.propTypes = {
  t: PropTypes.func.isRequired,
  tryAgain: PropTypes.func
};
