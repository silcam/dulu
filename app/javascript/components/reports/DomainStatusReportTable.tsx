import React, { useContext } from "react";
import DomainStatusItem from "../../models/DomainStatusItem";
import List from "../../models/List";
import { ILanguage } from "../../models/Language";
import { IPerson } from "../../models/Person";
import { IOrganization } from "../../models/Organization";
import { connect } from "react-redux";
import { AppState } from "../../reducers/appReducer";
import I18nContext from "../../contexts/I18nContext";
import { DomainReport } from "../../models/DomainReport";
import StyledTable from "../shared/StyledTable";
import { Link } from "react-router-dom";

interface IProps {
  report: DomainReport;
  languages: List<ILanguage>;
  people: List<IPerson>;
  organizations: List<IOrganization>;
}

function BaseDomainStatusReportTable(props: IProps) {
  const t = useContext(I18nContext);
  const statusItems = DomainStatusItem.emptyList().add(
    props.report.data.statusItems
  );
  return (
    <div>
      <h3>{t("Status")}</h3>
      <StyledTable>
        <tbody>
          <tr>
            <th />
          </tr>
          {statusItems.map(item => (
            <tr key={item.id}>
              <td>
                <Link to={`/languages/${item.language_id}`}>
                  {props.languages.get(item.language_id).name}
                </Link>
              </td>
              <td>{t(item.subcategory)}</td>
              <td>{item.year}</td>
              <td>{DomainStatusItem.personName(item, props.people)}</td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </div>
  );
}

const DomainStatusReportTable = connect((state: AppState) => ({
  languages: state.languages,
  people: state.people,
  organizations: state.organizations
}))(BaseDomainStatusReportTable);

export default DomainStatusReportTable;
