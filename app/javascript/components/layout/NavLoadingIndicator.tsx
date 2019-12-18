import React from "react";
import style from "./NavLoadingIndicator.css";

interface IProps {
  loading: boolean;
}

export default function NavLoadingIndicator(props: IProps) {
  return (
    <div className={style.container}>
      {props.loading && <div className={style.bar} />}
    </div>
  );
}
