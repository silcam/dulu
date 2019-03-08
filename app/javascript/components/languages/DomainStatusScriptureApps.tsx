import React, { useContext } from "react";
import I18nContext from "../../application/I18nContext";
import DomainStatusItem, {
  DSICategories,
  DSISubcategories,
  IDomainStatusItem
} from "../../models/DomainStatusItem";
import DomainStatusCategory from "./DomainStatusCategory";
import DomainStatusSubcategory from "./DomainStatusSubcategory";
import { ById } from "../../models/TypeBucket";
import { IPerson } from "../../models/Person";
import { IOrganization } from "../../models/Organization";
import { Link } from "react-router-dom";
import { orBlank } from "../../util/orBlank";
import takeFirst from "../../util/takeFirst";

interface IProps {
  domainStatusItems: IDomainStatusItem[];
  people: ById<IPerson>;
  organizations: ById<IOrganization>;
  basePath: string;
}

export default function DomainStatusScriptureApps(props: IProps) {
  const t = useContext(I18nContext);
  return (
    <DomainStatusCategory
      category={DSICategories.ScriptureApp}
      domainStatusItems={props.domainStatusItems}
      render={domainStatusItems => (
        <React.Fragment>
          {[
            DSISubcategories.Portions,
            DSISubcategories.NewTestament,
            DSISubcategories.Bible
          ].map(subcategory => (
            <DomainStatusSubcategory
              key={subcategory}
              showCheckbox
              subcategory={subcategory}
              domainStatusItems={domainStatusItems}
              renderItem={item => (
                <span>
                  <Link to={`${props.basePath}/${item.id}`}>
                    {takeFirst(item.platforms.replace("|", "-"), t("App"))}
                  </Link>
                  {orBlank(item.year, " ")}
                  {subcategory == DSISubcategories.Portions &&
                    "  " + DomainStatusItem.books(item, t)}
                </span>
              )}
            />
          ))}
        </React.Fragment>
      )}
    />
  );
}

// function Platforms({ item }: { item: IDomainStatusItem }) {
//   return (
//     <span>
//       {Object.values(AppPlatforms).map(platform => (
//         <CheckBoxInput
//           key={platform}
//           text={platform}
//           value={item.platforms.includes(platform)}
//           setValue={() => {}}
//         />
//       ))}
//     </span>
//   );
// }
