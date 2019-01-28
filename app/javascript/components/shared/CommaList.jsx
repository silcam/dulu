import React from "react";
import PropTypes from "prop-types";

export default function CommaList(props) {
  return props.list.map((item, index) => (
    <span key={index}>
      {props.render(item)}
      {index < props.list.length - 1 && ", "}
    </span>
  ));
}

CommaList.propTypes = {
  list: PropTypes.array.isRequired,
  render: PropTypes.func.isRequired
};
