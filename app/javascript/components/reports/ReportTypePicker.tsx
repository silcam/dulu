import React, { useContext } from "react";
import { ReportType, ReportTypes } from "../../models/Report";
import FormGroup from "../shared/FormGroup";
import SelectInput from "../shared/SelectInput";
import I18nContext from "../../contexts/I18nContext";

interface IProps {
  reportType: ReportType;
  setReportType: (rt: ReportType) => void;
}

export default function ReportTypePicker(props: IProps) {
  const t = useContext(I18nContext);
  return (
    <div>
      <FormGroup label={t("ReportType")}>
        <SelectInput
          value={props.reportType}
          options={SelectInput.translatedOptions(ReportTypes, t)}
          setValue={v => props.setReportType(v as ReportType)}
        />
      </FormGroup>
    </div>
  );
}
