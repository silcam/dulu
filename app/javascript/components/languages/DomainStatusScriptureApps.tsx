import React, { useContext } from "react";
import I18nContext from "../../contexts/I18nContext";
import DomainStatusItem, {
  IDomainStatusItem,
  ScripturePortion
} from "../../models/DomainStatusItem";
import DomainStatusCategory from "./DomainStatusCategory";
import DomainStatusSubcategory from "./DomainStatusSubcategory";
import { IPerson } from "../../models/Person";
import { IOrganization } from "../../models/Organization";
import { Link } from "react-router-dom";
import { orBlank } from "../../util/orBlank";
import takeFirst from "../../util/takeFirst";
import List from "../../models/List";

interface IProps {
  domainStatusItems: IDomainStatusItem[];
  people: List<IPerson>;
  organizations: List<IOrganization>;
  basePath: string;
}

export default function DomainStatusScriptureApps(props: IProps) {
  const t = useContext(I18nContext);
  return (
    <DomainStatusCategory
      category="ScriptureApp"
      domainStatusItems={props.domainStatusItems}
      render={domainStatusItems => (
        <React.Fragment>
          {["Portions", "New_testament", "Bible"].map(subcategory => (
            <DomainStatusSubcategory
              key={subcategory}
              showCheckbox
              subcategory={subcategory as ScripturePortion}
              domainStatusItems={domainStatusItems}
              renderItem={item => (
                <span>
                  <Link to={`${props.basePath}/${item.id}`}>
                    {takeFirst(item.platforms.replace("|", "-"), t("App"))}
                  </Link>
                  {orBlank(item.year, " ")}
                  {subcategory == "Portions" &&
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
