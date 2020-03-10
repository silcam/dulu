import React, { useContext, useState } from "react";
import EditActionBar from "../shared/EditActionBar";
import TextOrEditText from "../shared/TextOrEditText";
import SaveIndicator from "../shared/SaveIndicator";
import DangerButton from "../shared/DangerButton";
import TextOrTextArea from "../shared/TextOrTextArea";
import { Link } from "react-router-dom";
import { IOrganization } from "../../models/Organization";
import { History } from "history";
import I18nContext from "../../contexts/I18nContext";
import TextOrInput from "../shared/TextOrInput";
import { CountrySearchTextInput } from "../shared/SearchTextInput";
import update from "immutability-helper";
import useLoad, { useLoadOnMount } from "../shared/useLoad";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../../reducers/appReducer";
import OrganizationPicker from "./OrganizationPicker";
import { deleteOrganization } from "../../actions/organizationActions";

interface IProps {
  id: number;
  history: History;
}

export default function OrganizationPage(props: IProps) {
  const t = useContext(I18nContext);

  const organization = useSelector((state: AppState) =>
    state.organizations.get(props.id)
  );

  const [deleting, setDeleting] = useState(false);
  const [draftOrg, setDraftOrg] = useState<IOrganization | null>(null);
  const draftOrgValid = draftOrg && draftOrg.short_name.length > 0;

  useLoadOnMount(duluAxios => duluAxios.get(`/api/organizations/${props.id}`));
  const [load, loading] = useLoad();
  const dispatch = useDispatch();

  const updateOrganization = (mergeOrg: Partial<IOrganization>) =>
    setDraftOrg(update(draftOrg, { $merge: mergeOrg }));

  const edit = () => {
    setDraftOrg({ ...organization });
  };

  const save = async () => {
    if (draftOrgValid) {
      const data = await load(duluAxios =>
        duluAxios.put(`/api/organizations/${props.id}`, {
          organization: draftOrg
        })
      );
      if (data) {
        setDraftOrg(null);
      }
    }
  };

  const deleteOrg = async () => {
    const success = await load(duluAxios =>
      duluAxios.delete(`/api/organizations/${props.id}`)
    );
    if (success) {
      props.history.push("/organizations");
      dispatch(deleteOrganization(props.id));
    }
  };

  const org = draftOrg || organization;
  const foundParent = useSelector((state: AppState) =>
    state.organizations.get(org.parent_id || 0)
  );
  const parent = foundParent.id < 1 ? null : foundParent;

  return (
    <div>
      <EditActionBar
        can={org.can}
        editing={!!draftOrg}
        edit={edit}
        delete={() => setDeleting(true)}
        save={save}
        cancel={() => setDraftOrg(null)}
      />

      {deleting && (
        <DangerButton
          handleClick={deleteOrg}
          handleCancel={() => setDeleting(false)}
          message={t("delete_person_warning", {
            name: org.short_name
          })}
          buttonText={t("delete_person", {
            name: org.short_name
          })}
        />
      )}

      <SaveIndicator saving={loading} />

      <h2>
        <TextOrEditText
          editing={!!draftOrg}
          name="short_name"
          value={org.short_name}
          setValue={value => updateOrganization({ short_name: value })}
          validateNotBlank
        />
      </h2>

      <h3>
        <TextOrEditText
          editing={!!draftOrg}
          value={org.long_name || ""}
          label={t("Long_name")}
          setValue={value => {
            updateOrganization({ long_name: value });
          }}
        />
      </h3>

      <ul>
        <li>
          <strong>{t("Parent_organization")}:</strong>
          &nbsp;
          {!!draftOrg ? (
            <OrganizationPicker
              value={parent}
              setValue={parent =>
                updateOrganization({ parent_id: parent && parent.id })
              }
            />
          ) : (
            parent && (
              <Link to={`/organizations/${parent.id}`}>
                {parent.short_name}
              </Link>
            )
          )}
        </li>
        <li>
          <strong>{t("Country")}:</strong>
          &nbsp;
          <TextOrInput
            editing={!!draftOrg}
            text={org.country ? org.country.name : ""}
          >
            <CountrySearchTextInput
              text={org.country ? org.country.name : ""}
              updateValue={c => {
                const country = c || { name: "", id: undefined };
                updateOrganization({
                  country: country,
                  country_id: country.id
                });
              }}
              allowBlank
            />
          </TextOrInput>
        </li>
      </ul>
      <div style={{ marginTop: "16px" }}>
        <TextOrTextArea
          editing={!!draftOrg}
          label={t("Description")}
          value={org.description}
          setValue={value => updateOrganization({ description: value })}
        />
      </div>
    </div>
  );
}
