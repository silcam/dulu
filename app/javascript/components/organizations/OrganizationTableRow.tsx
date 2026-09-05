import React from "react";
import styles from "../shared/MasterDetail.css";
import { useHistory } from "react-router-dom";
import { IOrganization } from "../../models/Organization";

interface IProps {
  organization: IOrganization;
  selected?: boolean;
}

function TableRow(props: IProps) {
  const history = useHistory();
  const organization = props.organization;
  const rowClass = props.selected ? styles.selected : "";

  return (
    <tr
      className={rowClass}
      onClick={() => {
        history.push(`/organizations/show/${organization.id}`);
      }}
    >
      <td>{organization.short_name}</td>
    </tr>
  );
}

export default TableRow;
