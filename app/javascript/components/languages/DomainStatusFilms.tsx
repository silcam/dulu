import React, { useContext } from "react";
import I18nContext from "../../contexts/I18nContext";
import DomainStatusItem, {
  DSICategories,
  IDomainStatusItem
} from "../../models/DomainStatusItem";
import DomainStatusCategory from "./DomainStatusCategory";
import DomainStatusSubcategory from "./DomainStatusSubcategory";
import { ById } from "../../models/TypeBucket";
import { IPerson } from "../../models/Person";
import { IOrganization } from "../../models/Organization";
import { Link } from "react-router-dom";
import takeFirst from "../../util/takeFirst";
import { orBlank } from "../../util/orBlank";

interface IProps {
  domainStatusItems: IDomainStatusItem[];
  people: ById<IPerson>;
  organizations: ById<IOrganization>;
  basePath: string;
}

export default function DomainStatusFilms(props: IProps) {
  const t = useContext(I18nContext);
  return (
    <DomainStatusCategory
      category={DSICategories.Film}
      domainStatusItems={props.domainStatusItems}
      render={domainStatusItems =>
        domainStatusItems.length == 0
          ? t("None")
          : DomainStatusItem.categoryList[DSICategories.Film].map(film =>
              domainStatusItems.some(item => item.subcategory == film) ? (
                <DomainStatusSubcategory
                  key={film}
                  subcategory={film}
                  domainStatusItems={domainStatusItems}
                  renderItem={item => (
                    <span>
                      <Link to={`${props.basePath}/${item.id}`}>
                        {takeFirst(item.year, t(film))}
                      </Link>
                      {orBlank(
                        DomainStatusItem.orgName(item, props.organizations),
                        " - "
                      )}
                    </span>
                  )}
                />
              ) : null
            )
      }
    />
  );
}
