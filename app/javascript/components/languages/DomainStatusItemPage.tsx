import React, { useState, useContext } from "react";
import EditActionBar from "../shared/EditActionBar";
import { ILanguage } from "../../models/Language";
import { ById, Setter, Adder } from "../../models/TypeBucket";
import { IOrganization } from "../../models/Organization";
import { IPerson } from "../../models/Person";
import { findById } from "../../util/arrayUtils";
import { Link } from "react-router-dom";
import { useAPIGet, useAPIPut, useAPIDelete } from "../../util/useAPI";
import DomainStatusItemView from "./DomainStatusItemView";
import DomainStatusItemForm from "./DomainStatusItemForm";
import I18nContext from "../../application/I18nContext";
import { History } from "history";

interface IProps {
  language: ILanguage;
  domainStatusItemId: number;
  organizations: ById<IOrganization>;
  people: ById<IPerson>;
  history: History;

  setLanguage: Setter<ILanguage>;
  addPeople: Adder<IPerson>;
  addOrganizations: Adder<IOrganization>;
}

export default function DomainStatusItemPage(props: IProps) {
  const t = useContext(I18nContext);
  const actions = {
    setLanguage: props.setLanguage,
    addPeople: props.addPeople,
    addOrganizations: props.addOrganizations
  };
  useAPIGet(
    `/api/languages/${props.language.id}/domain_status_items`,
    {},
    actions
  );
  const [, save] = useAPIPut(
    `/api/domain_status_items/${props.domainStatusItemId}`,
    {},
    actions
  );

  const can = {
    update: props.language.can.update,
    destroy: props.language.can.update
  };
  const [editing, setEditing] = useState(false);

  const item = findById(
    props.language.domain_status_items,
    props.domainStatusItemId
  );

  const [, deleteItem] = useAPIDelete(
    `/api/domain_status_items/${props.domainStatusItemId}`,
    actions,
    t("confirm_delete_domain_status_item", {
      category: item ? t(item.category) : ""
    })
  );

  return (
    <div>
      <h4>
        <Link to={`/languages/${props.language.id}`}>{`< ${
          props.language.name
        }`}</Link>
      </h4>
      {!!item && (
        <div>
          {editing ? (
            <DomainStatusItemForm
              {...props}
              domainStatusItem={item}
              useEditActionBar
              cancel={() => setEditing(false)}
              save={item => save(() => setEditing(false), item)}
            />
          ) : (
            <div>
              <EditActionBar
                can={can}
                edit={() => setEditing(true)}
                delete={() =>
                  deleteItem(() =>
                    props.history.replace(`/languages/${props.language.id}`)
                  )
                }
              />
              <DomainStatusItemView {...props} item={item} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
