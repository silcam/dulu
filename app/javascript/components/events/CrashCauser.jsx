import React from "react";

export default function(props) {
  return <p> Time for errors! {props.notAFunction()}</p>;
}
