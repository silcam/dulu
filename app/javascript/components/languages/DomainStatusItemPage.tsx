import { useNavigate, useParams } from "react-router-dom";
import { useLanguageContext } from "./LanguagePageRouter";
import React, { useState, useContext } from "react";
import EditActionBar from "../shared/EditActionBar";
import { findById } from "../../util/arrayUtils";
import DomainStatusItemView from "./DomainStatusItemView";
import DomainStatusItemForm, { DsiForServer } from "./DomainStatusItemForm";
import I18nContext from "../../contexts/I18nContext";
import BreadCrumbs, { LanguageBackLink } from "../shared/BreadCrumbs";
import useLoad, { useLoadOnMount } from "../shared/useLoad";

export default function DomainStatusItemPage() {
  const { language } = useLanguageContext();
  const domainStatusItemId = parseInt(useParams().domainStatusItemId!);
  const props = { language, domainStatusItemId };
  const navigate = useNavigate();
  const t = useContext(I18nContext);

  useLoadOnMount(`/api/languages/${props.language.id}/domain_status_items`);

  const [saveLoad] = useLoad();
  const save = async (item: DsiForServer) => {
    await saveLoad(duluAxios =>
      duluAxios.put(
        `/api/domain_status_items/${props.domainStatusItemId}`,
        item
      )
    );
    setEditing(false);
  };
  const deleteItem = async () => {
    if (
      confirm(
        t("confirm_delete_domain_status_item", {
          category: item ? t(item.category) : ""
        })
      )
    ) {
      await saveLoad(duluAxios =>
        duluAxios.delete(`/api/domain_status_items/${props.domainStatusItemId}`)
      );
      navigate(`/languages/${props.language.id}`, { replace: true });
    }
  };

  const can = {
    update: props.language.can.update,
    destroy: props.language.can.update
  };
  const [editing, setEditing] = useState(false);

  const item = findById(
    props.language.domain_status_items,
    props.domainStatusItemId
  );

  return (
    <div className="padBottom">
      {!!item && item.category == "DataCollection" ? (
        <BreadCrumbs
          links={[
            [`/languages/${props.language.id}`, props.language.name],
            [
              `/languages/${props.language.id}/domain_status_items/lingdata/${item.subcategory}`,
              item.subcategory
            ]
          ]}
        />
      ) : (
        <LanguageBackLink language={props.language} />
      )}
      {!!item && (
        <div>
          {editing ? (
            <DomainStatusItemForm
              {...props}
              domainStatusItem={item}
              useEditActionBar
              cancel={() => setEditing(false)}
              save={item => save(item)}
            />
          ) : (
            <div>
              <EditActionBar
                can={can}
                edit={() => setEditing(true)}
                delete={() => deleteItem()}
              />
              <DomainStatusItemView {...props} item={item} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
