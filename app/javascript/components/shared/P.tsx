import React from "react";
import style from "./P.css";
import { Children } from "../../models/TypeBucket";

interface IProps {
  children: Children;
}

export default function P(props: IProps) {
  return <div className={style.P}>{props.children}</div>;
}
