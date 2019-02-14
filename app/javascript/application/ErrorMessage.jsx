import React from "react";
import PropTypes from "prop-types";

export default function ErrorMessage(props) {
  return (
    <div style={{ paddingLeft: "40px" }}>
      <h2>{props.t("ErrorHeader")}</h2>
      <p>{props.t("ErrorMessage")}</p>
      <button
        onClick={() => {
          location.reload();
        }}
      >
        {props.t("Reload")}
      </button>
    </div>
  );
}

ErrorMessage.propTypes = {
  t: PropTypes.func.isRequired
};
