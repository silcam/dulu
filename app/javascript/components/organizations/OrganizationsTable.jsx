import React from "react";
import OrganizationTableRow from "./OrganizationTableRow";
import { Link } from "react-router-dom";

export default function OrganizationsTable(props) {
  const organizations = props.organizations;
  const t = props.t;
  if (organizations.length == 0) {
    return <p className="alertBox alertYellow">{t("Loading")}</p>;
  }
  return (
    <div>
      {props.can.create && (
        <p style={{ paddingLeft: "8px" }}>
          <Link to="/organizations/new" className="btn">
            {t("Add_new_organization")}
          </Link>
        </p>
      )}
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
