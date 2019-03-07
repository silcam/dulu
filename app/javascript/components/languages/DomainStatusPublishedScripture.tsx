import React, { useContext } from "react";
import I18nContext from "../../application/I18nContext";
import {
  DSICategories,
  DSISubcategories,
  IDomainStatusItem
} from "../../models/DomainStatusItem";
import DomainStatusCategory from "./DomainStatusCategory";
import DomainStatusSubcategory from "./DomainStatusSubcategory";
import { orBlank } from "../../util/orBlank";
import BibleBook from "../../models/BibleBook";
import { Link } from "react-router-dom";

interface IProps {
  domainStatusItems: IDomainStatusItem[];
  basePath: string;
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
                    ? item.bible_book_ids
                        .map(id => BibleBook.name(id, t))
                        .join("-")
                    : t("Portions")}
                </Link>
                {orBlank(item.year, " (", ")")}
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
                  {t("New_testament")}
                </Link>
                {orBlank(item.year, " - ")}
              </span>
            )}
          />
          <DomainStatusSubcategory
            showCheckbox
            subcategory={DSISubcategories.Bible}
            domainStatusItems={domainStatusItems}
            renderItem={item => (
              <span>
                <Link to={`${props.basePath}/${item.id}`}>{t("Bible")}</Link>{" "}
                {orBlank(item.year, " - ")}
              </span>
            )}
          />
        </React.Fragment>
      )}
    />
  );
}
