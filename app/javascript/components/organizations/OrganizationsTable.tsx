import React from "react";
import OrganizationTableRow from "./OrganizationTableRow";
import Loading from "../shared/Loading";
import { IOrganization } from "../../models/Organization";

interface IProps {
  organizations: IOrganization[];
  id?: number;
}

export default function OrganizationsTable(props: IProps) {
  if (props.organizations.length == 0) {
    return <Loading />;
  }
  return (
    <div>
      <table>
        <tbody>
          {props.organizations.map(organization => (
            <OrganizationTableRow
              key={organization.id}
              organization={organization}
              selected={props.id == organization.id}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
