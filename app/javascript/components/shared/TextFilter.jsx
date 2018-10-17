import React from "react";

export default function TextFilter(props) {
  return (
    <input
      type="text"
      value={props.filter}
      placeholder={props.placeholder}
      onChange={e => props.updateFilter(e.target.value)}
    />
  );
}
