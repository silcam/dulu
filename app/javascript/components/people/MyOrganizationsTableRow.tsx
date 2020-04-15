import React, { useState } from "react";
import EditIcon from "../shared/icons/EditIcon";
import DeleteIcon from "../shared/icons/DeleteIcon";
import MyOrganizationForm from "./MyOrganizationForm";
import { Link } from "react-router-dom";
import dateString from "../../util/dateString";
import { fullName, IPerson } from "../../models/Person";
import { IOrganizationPerson, IOrganization } from "../../models/Organization";
import useLoad from "../shared/useLoad";
import useTranslation from "../../i18n/useTranslation";

interface IProps {
  org_person: IOrganizationPerson;
  organization: IOrganization;
  person: IPerson;
}

export default function MyOrganizationsTableRow(props: IProps) {
  const t = useTranslation();
  const [saveLoad] = useLoad();

  const [editing, setEditing] = useState(false);

  const updateOrganizationPerson = async (
    organization_person: IOrganizationPerson
  ) => {
    const data = await saveLoad(duluAxios =>
      duluAxios.put(`/api/organization_people/${organization_person.id}`, {
        organization_person
      })
    );
    if (data) setEditing(false);
  };

  const deleteOrganizationPerson = async () => {
    saveLoad(duluAxios =>
      duluAxios.delete(`/api/organization_people/${props.org_person.id}`)
    );
  };

  const orgPerson = props.org_person;
  const organization = props.organization;

  return editing ? (
    <MyOrganizationForm
      organization_person={orgPerson}
      organization={organization}
      cancelEdit={() => setEditing(false)}
      updateOrganizationPerson={updateOrganizationPerson}
    />
  ) : (
    <tr>
      <td>
        <Link to={`/organizations/show/${organization.id}`}>
          {organization.short_name}
        </Link>
      </td>
      <td>
        {orgPerson.start_date &&
          `${dateString(
            orgPerson.start_date,
            t("month_names_short")
          )} - ${dateString(orgPerson.end_date, t("month_names_short"))}`}
      </td>
      <td>{orgPerson.position}</td>
      {props.person.can.update && (
        <td>
          <EditIcon onClick={() => setEditing(true)} />
          <DeleteIcon
            onClick={() => {
              if (
                window.confirm(
                  t("confirm_delete_org_person", {
                    org: organization.short_name,
                    person: fullName(props.person)
                  })
                )
              )
                deleteOrganizationPerson();
            }}
          />
        </td>
      )}
    </tr>
  );
}
