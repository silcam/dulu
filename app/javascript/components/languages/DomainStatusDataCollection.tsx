import React from "react";
import {
  IDomainStatusItem,
  DataCollections,
  latestItem,
  DataCollection,
  lingCompleteSat,
  countText,
  countUnit
} from "../../models/DomainStatusItem";
import { IPerson } from "../../models/Person";
import List from "../../models/List";
import DomainStatusCategory from "./DomainStatusCategory";
import DomainStatusSubcategory from "./DomainStatusSubcategory";
import styles from "./DomainStatus.css";
import DSLingCompleteStyler from "./DSLingCompleteStyler";
import { Link } from "react-router-dom";
// import I18nContext from "../../contexts/I18nContext";

interface IProps {
  domainStatusItems: IDomainStatusItem[];
  basePath: string;
  people: List<IPerson>;
}

export default function DomainStatusDataCollection(props: IProps) {
  // const t = useContext(I18nContext);
  return (
    <DomainStatusCategory
      category="DataCollection"
      domainStatusItems={props.domainStatusItems}
      render={domainStatusItems =>
        DataCollections.map(collectionType => (
          <DomainStatusSubcategory
            key={collectionType}
            showCheckbox
            checkboxChecked={dataCollectionComplete(
              collectionType,
              domainStatusItems
            )}
            subcategory={collectionType}
            domainStatusItems={domainStatusItems}
            render={domainStatusItems => {
              const latest = latestItem(domainStatusItems);
              if (!latest) return <span />;
              return (
                <ul>
                  <li className={styles.ds_item}>
                    <DSLingCompleteStyler item={latest}>
                      <Link to={`${props.basePath}/lingdata/${collectionType}`}>
                        {`${countText(latest)} ${countUnit(
                          latest.subcategory as DataCollection
                        )} ${latest.year || ""}`}
                      </Link>
                    </DSLingCompleteStyler>
                  </li>
                </ul>
              );
            }}
          />
        ))
      }
    />
  );
}

function dataCollectionComplete(
  collectionType: DataCollection,
  domainStatusItems: IDomainStatusItem[]
) {
  const latest = latestItem(
    domainStatusItems.filter(item => item.subcategory == collectionType)
  );
  return latest && lingCompleteSat(latest);
}
