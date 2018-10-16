import React from "react";
import PropTypes from "prop-types";
import withRouter from "react-router-dom/withRouter";

function CancelButtonInner(props) {
  return (
    <button className="btnRed" onClick={props.history.goBack}>
      {props.t("Cancel")}
    </button>
  );
}

CancelButtonInner.propTypes = {
  t: PropTypes.func,
  history: PropTypes.object
};

const CancelButton = withRouter(CancelButtonInner);

export default CancelButton;
