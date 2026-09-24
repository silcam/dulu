import React from "react";

export default function CrashCauser(props) {
  return <p> Time for errors! {props.notAFunction()}</p>;
}
