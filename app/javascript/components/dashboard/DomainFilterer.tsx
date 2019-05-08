import React, { useContext } from "react";
import SelectInput from "../shared/SelectInput";
import selectOptionsFromObject from "../../util/selectOptionsFromObject";
import { T } from "../../i18n/i18n";
import I18nContext from "../../contexts/I18nContext";

interface IProps {
  setDomainFilter: (domain: string) => void;
  domainFilter: string;
}

export default function DomainFilterer(props: IProps) {
  const t = useContext(I18nContext);

  return (
    <div style={{ marginBottom: "4px" }}>
      <label>
        {t("Filter")}
        :&nbsp;
      </label>
      <SelectInput
        value={props.domainFilter}
        options={domainOptions(t)}
        setValue={props.setDomainFilter}
        extraClasses={"input-sm extraSmall form-control-inline"}
      />
    </div>
  );
}

function domainOptions(t: T) {
  return [{ display: t("All"), value: "All" }].concat(
    selectOptionsFromObject(t("domains"))
  );
}
