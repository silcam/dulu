import React from "react";
import PropTypes from "prop-types";
import style from "./P.css";

export default function P(props) {
  return <div className={style.P}>{props.children}</div>;
}

P.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};
