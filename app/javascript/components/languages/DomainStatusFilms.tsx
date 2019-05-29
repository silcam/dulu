import React, { useContext } from "react";
import I18nContext from "../../contexts/I18nContext";
import DomainStatusItem, {
  IDomainStatusItem
} from "../../models/DomainStatusItem";
import DomainStatusCategory from "./DomainStatusCategory";
import DomainStatusSubcategory from "./DomainStatusSubcategory";
import { IPerson } from "../../models/Person";
import { IOrganization } from "../../models/Organization";
import { Link } from "react-router-dom";
import takeFirst from "../../util/takeFirst";
import { orBlank } from "../../util/orBlank";
import List from "../../models/List";

interface IProps {
  domainStatusItems: IDomainStatusItem[];
  people: List<IPerson>;
  organizations: List<IOrganization>;
  basePath: string;
}

export default function DomainStatusFilms(props: IProps) {
  const t = useContext(I18nContext);
  return (
    <DomainStatusCategory
      category={"Film"}
      domainStatusItems={props.domainStatusItems}
      render={domainStatusItems =>
        domainStatusItems.length == 0
          ? t("None")
          : DomainStatusItem.categoryList.Film.map(film =>
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
