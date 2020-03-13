import React, { useContext } from "react";
import {
  IDomainStatusItem,
  LiteracyMaterials
} from "../../models/DomainStatusItem";
import I18nContext from "../../contexts/I18nContext";
import DomainStatusCategory from "./DomainStatusCategory";
import DomainStatusSubcategory from "./DomainStatusSubcategory";
import { Link } from "react-router-dom";
import { takeFirstNonBlank } from "../../util/takeFirst";
import ifDef from "../../util/ifDef";

interface IProps {
  domainStatusItems: IDomainStatusItem[];
  basePath: string;
}

export default function DomainStatusLiteracyMaterials(props: IProps) {
  const t = useContext(I18nContext);

  return (
    <DomainStatusCategory
      category="LiteracyMaterial"
      label={t("LiteracyMaterials")}
      domainStatusItems={props.domainStatusItems}
      render={domainStatusItems => (
        <React.Fragment>
          {LiteracyMaterials.map(subCategory => (
            <DomainStatusSubcategory
              key={subCategory}
              showCheckbox
              checkboxChecked={
                !!domainStatusItems.find(dsi => dsi.subcategory == subCategory)
              }
              subcategory={subCategory}
              domainStatusItems={domainStatusItems}
              renderItem={item => (
                <Link to={`${props.basePath}/${item.id}`}>
                  {takeFirstNonBlank(
                    `${ifDef(item.year)} ${item.title}`,
                    t(subCategory)
                  )}
                </Link>
              )}
            />
          ))}
        </React.Fragment>
      )}
    />
  );
}
