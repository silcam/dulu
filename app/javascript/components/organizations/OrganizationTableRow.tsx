import React from "react";
import styles from "../shared/MasterDetail.css";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { IOrganization } from "../../models/Organization";

interface IProps extends RouteComponentProps {
  organization: IOrganization;
  selected?: boolean;
}

function TableRow(props: IProps) {
  const organization = props.organization;
  const rowClass = props.selected ? styles.selected : "";

  return (
    <tr
      className={rowClass}
      onClick={() => {
        props.history.push(`/organizations/show/${organization.id}`);
      }}
    >
      <td>{organization.short_name}</td>
    </tr>
  );
}

const OrganizationTableRow = withRouter(TableRow);

export default OrganizationTableRow;
