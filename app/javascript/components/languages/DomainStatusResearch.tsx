import React, { useContext } from "react";
import DomainStatusCategory from "./DomainStatusCategory";
import DomainStatusItem, {
  IDomainStatusItem,
  DSICompleteness,
  LingResearch,
  GrammarTypes,
  DiscourseTypes,
  LingResearches
} from "../../models/DomainStatusItem";
import DomainStatusSubcategory from "./DomainStatusSubcategory";
import { Link } from "react-router-dom";
import { IPerson } from "../../models/Person";
import List from "../../models/List";
import { all } from "../../util/arrayUtils";
import DSLingCompleteStyler from "./DSLingCompleteStyler";
import I18nContext from "../../contexts/I18nContext";

interface IProps {
  domainStatusItems: IDomainStatusItem[];
  basePath: string;
  people: List<IPerson>;
}

export default function DomainStatusResearch(props: IProps) {
  return (
    <DomainStatusCategory
      category="Research"
      domainStatusItems={props.domainStatusItems}
      render={domainStatusItems => (
        <React.Fragment>
          {LingResearches.map(subCategory => (
            <DomainStatusSubcategory
              key={subCategory}
              showCheckbox
              checkboxChecked={researchSubCategoryComplete(
                subCategory,
                domainStatusItems
              )}
              subcategory={subCategory}
              domainStatusItems={domainStatusItems}
              renderItem={item => (
                <DSLingCompleteStyler item={item}>
                  <Link to={`${props.basePath}/${item.id}}`}>
                    {DomainStatusItem.personName(item, props.people)}{" "}
                    {item.year}
                  </Link>
                  <DSResearchItemExtras item={item} />
                </DSLingCompleteStyler>
              )}
            />
          ))}
        </React.Fragment>
      )}
    />
  );
}

function DSResearchItemExtras(props: { item: IDomainStatusItem }) {
  const item = props.item;
  const t = useContext(I18nContext);
  let extraText = "";
  if (item.subcategory == "Grammar") {
    extraText = GrammarTypes.filter(g => item.details[g])
      .map(g => t(g))
      .join(", ");
  }
  if (item.subcategory == "Discourse") {
    extraText = DiscourseTypes.filter(d => item.details[d])
      .map(d => t(d))
      .join(", ");
  }
  return extraText.length == 0 ? null : (
    <div style={{ paddingLeft: "10px", fontSize: "smaller" }}>{extraText}</div>
  );
}

function researchSubCategoryComplete(
  subCategory: LingResearch,
  domainStatusItems: IDomainStatusItem[]
) {
  const satCompletenesses: DSICompleteness[] = ["Complete", "Satisfactory"];
  const completedItems = domainStatusItems.filter(
    item =>
      item.subcategory == subCategory &&
      satCompletenesses.includes(item.completeness)
  );
  switch (subCategory) {
    case "Grammar":
      return all(GrammarTypes, grammarType =>
        completedItems.some(item => !!item.details[grammarType])
      );
    case "Discourse":
      return all(DiscourseTypes, discourseType =>
        completedItems.some(item => !!item.details[discourseType])
      );
    default:
      return completedItems.length > 0;
  }
}
