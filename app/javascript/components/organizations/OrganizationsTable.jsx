import React from "react";
import OrganizationTableRow from "./OrganizationTableRow";
import Loading from "../shared/Loading";

export default function OrganizationsTable(props) {
  const filter = new RegExp(props.filter, "i");
  const organizations = props.organizations.filter(org =>
    org.short_name.match(filter)
  );

  const t = props.t;
  if (props.organizations.length == 0) {
    return <Loading />;
  }
  if (organizations.length == 0) {
    return <p>{t("NoneFound")}</p>;
  }
  return (
    <div>
      <table>
        <tbody>
          {organizations.map(organization => (
            <OrganizationTableRow
              key={organization.id}
              organization={organization}
              t={t}
              selected={props.id == organization.id}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
