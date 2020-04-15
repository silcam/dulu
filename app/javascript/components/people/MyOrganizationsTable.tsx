import React, { useState } from "react";
import MyOrganizationsTableRow from "./MyOrganizationsTableRow";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import InlineAddIcon from "../shared/icons/InlineAddIcon";
import { OrganizationPicker } from "../shared/SearchPicker";
import { IPerson } from "../../models/Person";
import { IOrganization } from "../../models/Organization";
import I18nContext from "../../contexts/I18nContext";
import useLoad, { useLoadOnMount } from "../shared/useLoad";
import useAppSelector from "../../reducers/useAppSelector";
import useTranslation from "../../i18n/useTranslation";

interface IProps {
  person: IPerson;
}

export default function (props: IProps) {
  const t = useTranslation();
  const [saveLoad] = useLoad();

  const organizationPeople = useAppSelector(
    state => state.organizationPeople
  ).filter(op => op.person_id == props.person.id);
  const organizations = useAppSelector(state => state.organizations);

  const [newOrganization, setNewOrganization] = useState<IOrganization | null>(
    null
  );
  const [addingNew, setAddingNew] = useState(false);

  useLoadOnMount(`/api/organization_people?person_id=${props.person.id}`, [
    props.person.id
  ]);
  useLoadOnMount("/api/organizations");

  const createOrganizationPerson = async () => {
    if (!newOrganization) return;
    const organization_person = {
      person_id: props.person.id,
      organization_id: newOrganization.id
    };
    const data = await saveLoad(duluAxios =>
      duluAxios.post("/api/organization_people", {
        organization_person
      })
    );
    if (data) setAddingNew(false);
  };

  return (
    <div>
      <h3>
        {t("Organizations")}
        {props.person.can.update && (
          <InlineAddIcon onClick={() => setAddingNew(true)} />
        )}
      </h3>
      <table>
        <tbody>
          {organizationPeople.map(org_person => (
            <MyOrganizationsTableRow
              key={org_person.id}
              org_person={org_person}
              organization={organizations.get(org_person.organization_id)}
              person={props.person}
            />
          ))}
          {addingNew && (
            <tr>
              <td colSpan={4}>
                <OrganizationPicker
                  collection={organizations}
                  selectedId={newOrganization && newOrganization.id}
                  setSelected={setNewOrganization}
                  autoFocus
                  allowBlank
                />
                <SmallSaveAndCancel
                  handleSave={createOrganizationPerson}
                  handleCancel={() => setAddingNew(false)}
                  saveDisabled={!newOrganization}
                  style={{ marginTop: "8px" }}
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
