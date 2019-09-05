import React, { useContext } from "react";
import Activity, { IActivity } from "../../models/Activity";
import { DomainReport } from "../../models/DomainReport";
import I18nContext from "../../contexts/I18nContext";
import { ILanguage } from "../../models/Language";
import List from "../../models/List";
import { AppState } from "../../reducers/appReducer";
import { connect } from "react-redux";
import StyledTable from "../shared/StyledTable";
import { Link } from "react-router-dom";

export interface ActivityReportItem {
  activity: IActivity;
  id: number; // Stage id
  stage: string;
  date: string;
}

interface IProps {
  report: DomainReport;
  languages: List<ILanguage>;
}

function BaseActivityReportTable(props: IProps) {
  const t = useContext(I18nContext);
  return (
    <div>
      <h3>{t("Translation_activity")}</h3>
      <StyledTable>
        <tbody>
          <tr>
            <th>{t("Language")}</th>
            <th>{t("Book")}</th>
            <th>{t("Stage")}</th>
            <th>{t("Date")}</th>
          </tr>
          {props.report.data.activityReportItems.map(item => (
            <tr key={item.id}>
              <td>
                <Link to={`/languages/${item.activity.language_id}`}>
                  {props.languages.get(item.activity.language_id).name}
                </Link>
              </td>
              <td>{Activity.name(item.activity, t)}</td>
              <td>{t(`stage_names.${item.stage}`)}</td>
              <td>{item.date}</td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </div>
  );
}

const ActivityReportTable = connect((state: AppState) => ({
  languages: state.languages
}))(BaseActivityReportTable);

export default ActivityReportTable;
