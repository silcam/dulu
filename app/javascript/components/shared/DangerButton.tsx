import React, { ChangeEvent, useState, useContext } from "react";
import styles from "./Callout.css";
import I18nContext from "../../application/I18nContext";

interface IProps {
  handleClick: () => void;
  handleCancel: () => void;
  message: string;
  buttonText: string;
}

export default function DangerButton(props: IProps) {
  const [userIsSure, setUserIsSure] = useState(false);
  const t = useContext(I18nContext);

  const checkboxClick = (e: ChangeEvent<HTMLInputElement>) =>
    setUserIsSure(e.target.checked);

  return (
    <div className={styles.calloutRed}>
      <h4>{props.message}</h4>
      <label style={{ display: "block" }}>
        <input
          type="checkbox"
          name="dangerButtonCheckbox"
          onChange={checkboxClick}
          checked={userIsSure}
        />
        &nbsp;
        {t("Im_sure")}
      </label>
      <button
        className="btnRed"
        onClick={props.handleClick}
        disabled={!userIsSure}
      >
        {props.buttonText}
      </button>
      &nbsp;
      <button onClick={props.handleCancel}>{t("Cancel")}</button>
    </div>
  );
}
