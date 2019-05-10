import React, { useContext } from "react";
import I18nContext from "../../contexts/I18nContext";

interface IProps {
  handleInput: (year: string) => void;
  value: string;
  name?: string;
}

export default function YearInput(props: IProps) {
  const name = props.name || "year";
  const t = useContext(I18nContext);
  return (
    <input
      type="text"
      name={name}
      value={props.value}
      size={4}
      maxLength={4}
      placeholder={t("Year")}
      onChange={e => props.handleInput(e.target.value)}
      className="form-control"
    />
  );
}
