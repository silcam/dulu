import React from "react";
import PropTypes from "prop-types";
import AlertBox from "./AlertBox";

export default function Loading(props) {
  return <AlertBox text={props.t("Loading")} />;
}

Loading.propTypes = {
  t: PropTypes.func.isRequired
};
