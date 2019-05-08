import React, { useContext } from "react";
import YesNoSelect, { IProps as YesNoSelectProps } from "./YesNoSelect";
import I18nContext from "../../contexts/I18nContext";

interface IProps extends YesNoSelectProps {
  editing?: boolean;
}

export default function TextOrYesNo(props: IProps) {
  const t = useContext(I18nContext);

  const { editing, ...otherProps } = props;
  return props.editing ? (
    <YesNoSelect {...otherProps} />
  ) : (
    <span>{props.value ? t("Yes") : t("No")}</span>
  );
}
