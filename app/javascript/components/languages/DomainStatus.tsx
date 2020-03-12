import React, { useContext, useState } from "react";
import { ILanguage } from "../../models/Language";
import I18nContext from "../../contexts/I18nContext";
import Spacer from "../shared/Spacer";
import DomainStatusNew from "./DomainStatusNew";
import AddIcon from "../shared/icons/AddIcon";
import { DSICategory } from "../../models/DomainStatusItem";
import DomainStatusX from "./DomainStatusX";
import StyledTable from "../shared/StyledTable";
import { useLoadOnMount } from "../shared/useLoad";

export interface DSProps {
  language: ILanguage;
  categories: DSICategory[];
}

export default function DomainStatus(props: DSProps) {
  const t = useContext(I18nContext);
  const [addingNew, setAddingNew] = useState(false);

  const loading = useLoadOnMount(
    `/api/languages/${props.language.id}/domain_status_items`
  );

  const allDomainStatusItems = props.language.domain_status_items;

  if (props.categories.length == 0) return <p />;

  if (loading && allDomainStatusItems.length == 0) return <p />;

  return (
    <div>
      <h3>
        {t("Status")}
        {props.language.can.update && !addingNew && (
          <React.Fragment>
            <Spacer width="10px" />
            <AddIcon onClick={() => setAddingNew(true)} />
          </React.Fragment>
        )}
      </h3>
      {addingNew ? (
        <DomainStatusNew {...props} cancel={() => setAddingNew(false)} />
      ) : (
        <StyledTable>
          <tbody>
            {props.categories.map(category => (
              <DomainStatusX
                key={category}
                category={category}
                domainStatusItems={allDomainStatusItems}
                basePath={`/languages/${props.language.id}/domain_status_items`}
              />
            ))}
          </tbody>
        </StyledTable>
      )}
    </div>
  );
}
