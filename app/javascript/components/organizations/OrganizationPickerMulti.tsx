import React, { useContext } from "react";
import { IOrganization } from "../../models/Organization";
import I18nContext from "../../contexts/I18nContext";
import MultiSelectItemList from "../shared/MultiSelectItemList";
import OrganizationPicker from "./OrganizationPicker";

interface IProps {
  organizations: IOrganization[];
  setOrganizations: (orgs: IOrganization[]) => void;
}

export default function OrganizationPickerMulti(props: IProps) {
  const t = useContext(I18nContext);

  return (
    <div>
      <MultiSelectItemList
        items={props.organizations}
        display={org => org.short_name}
        removeItem={organization =>
          props.setOrganizations(
            props.organizations.filter(org => org.id != organization.id)
          )
        }
      />
      <OrganizationPicker
        value={null}
        setValue={org =>
          org && props.setOrganizations([...props.organizations, org])
        }
        placeholder={t("Add_organization")}
        autoClear
      />
    </div>
  );
}
