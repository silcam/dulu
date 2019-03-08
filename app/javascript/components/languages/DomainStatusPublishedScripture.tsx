import React, { useContext } from "react";
import I18nContext from "../../application/I18nContext";
import DomainStatusItem, {
  DSICategories,
  DSISubcategories,
  IDomainStatusItem
} from "../../models/DomainStatusItem";
import DomainStatusCategory from "./DomainStatusCategory";
import DomainStatusSubcategory from "./DomainStatusSubcategory";
import { orBlank } from "../../util/orBlank";
import { Link } from "react-router-dom";
import takeFirst from "../../util/takeFirst";
import { ById } from "../../models/TypeBucket";
import { IOrganization } from "../../models/Organization";

interface IProps {
  domainStatusItems: IDomainStatusItem[];
  basePath: string;
  organizations: ById<IOrganization>;
}

export default function DomainStatusPublishedScripture(props: IProps) {
  const t = useContext(I18nContext);
  return (
    <DomainStatusCategory
      category={DSICategories.PublishedScripture}
      domainStatusItems={props.domainStatusItems}
      render={domainStatusItems => (
        <React.Fragment>
          <DomainStatusSubcategory
            showCheckbox
            subcategory={DSISubcategories.Portions}
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
                  DomainStatusItem.orgName(item, props.organizations),
                  " - "
                )}
              </span>
            )}
          />
          <DomainStatusSubcategory
            showCheckbox
            subcategory={DSISubcategories.NewTestament}
            domainStatusItems={domainStatusItems}
            renderItem={item => (
              <span>
                <Link to={`${props.basePath}/${item.id}`}>
                  {takeFirst(item.year, t("New_testament"))}
                </Link>
                {orBlank(
                  DomainStatusItem.orgName(item, props.organizations),
                  " - "
                )}
              </span>
            )}
          />
          <DomainStatusSubcategory
            showCheckbox
            subcategory={DSISubcategories.Bible}
            domainStatusItems={domainStatusItems}
            renderItem={item => (
              <span>
                <Link to={`${props.basePath}/${item.id}`}>
                  {takeFirst(item.year, t("Bible"))}
                </Link>
                {orBlank(
                  DomainStatusItem.orgName(item, props.organizations),
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
