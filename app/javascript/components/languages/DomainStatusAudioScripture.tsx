import React, { useContext } from "react";
import I18nContext from "../../contexts/I18nContext";
import DomainStatusItem, {
  IDomainStatusItem
} from "../../models/DomainStatusItem";
import DomainStatusCategory from "./DomainStatusCategory";
import DomainStatusSubcategory from "./DomainStatusSubcategory";
import { orBlank } from "../../util/orBlank";
import { Link } from "react-router-dom";
import takeFirst from "../../util/takeFirst";
import List from "../../models/List";
import { IOrganization } from "../../models/Organization";

interface IProps {
  domainStatusItems: IDomainStatusItem[];
  basePath: string;
  organizations: List<IOrganization>;
}

export default function DomainStatusAudioScripture(props: IProps) {
  const t = useContext(I18nContext);
  return (
    <DomainStatusCategory
      category="AudioScripture"
      domainStatusItems={props.domainStatusItems}
      render={domainStatusItems => (
        <React.Fragment>
          <DomainStatusSubcategory
            showCheckbox
            subcategory="Portions"
            domainStatusItems={domainStatusItems}
            renderItem={item => (
              <span>
                <Link to={`${props.basePath}/${item.id}`}>
                  {item.bible_book_ids.length > 0
                    ? DomainStatusItem.books(item, t, 3)
                    : t("Portions")}
                </Link>
                {orBlank(item.year, " ")}
                {orBlank(
                  DomainStatusItem.orgNames(item, props.organizations).join(
                    ", "
                  ),
                  " - "
                )}
              </span>
            )}
          />
          <DomainStatusSubcategory
            showCheckbox
            subcategory="New_testament"
            domainStatusItems={domainStatusItems}
            renderItem={item => (
              <span>
                <Link to={`${props.basePath}/${item.id}`}>
                  {takeFirst(item.year, t("New_testament"))}
                </Link>
                {orBlank(
                  DomainStatusItem.orgNames(item, props.organizations).join(
                    ", "
                  ),
                  " - "
                )}
              </span>
            )}
          />
          <DomainStatusSubcategory
            showCheckbox
            subcategory="Bible"
            domainStatusItems={domainStatusItems}
            renderItem={item => (
              <span>
                <Link to={`${props.basePath}/${item.id}`}>
                  {takeFirst(item.year, t("Bible"))}
                </Link>
                {orBlank(
                  DomainStatusItem.orgNames(item, props.organizations).join(
                    ", "
                  ),
                  " - "
                )}
              </span>
            )}
          />
        </React.Fragment>
      )}
    />
  );
}
