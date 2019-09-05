import React, { useContext } from "react";
import { SearchPickerAutoClear } from "./SearchPicker";
import MultiSelectItemList from "./MultiSelectItemList";
import I18nContext from "../../contexts/I18nContext";
import List from "../../models/List";
import { ILanguage } from "../../models/Language";
import { ICluster } from "../../models/Cluster";

interface IProps<T extends { id: number }> {
  allItems: List<T>;
  selectedItems: List<T>;
  setSelectedItems: (selectedItems: List<T>) => void;
  display: (item: T) => string;
  placeholder: string;
}

export default function ModelMultiSelect<T extends { id: number }>(
  props: IProps<T>
) {
  const addItem = (item: T) =>
    props.setSelectedItems(props.selectedItems.add([item]));
  const removeItem = (item: T) =>
    props.setSelectedItems(props.selectedItems.remove(item.id));

  return (
    <div
      style={{
        maxWidth: "200px"
      }}
    >
      <div>
        <SearchPickerAutoClear
          collection={filteredList(props.allItems, props.selectedItems)}
          setSelected={addItem}
          placeholder={props.placeholder}
        />
      </div>
      <div style={{}}>
        <MultiSelectItemList
          items={props.selectedItems.toArray()}
          display={props.display}
          removeItem={removeItem}
          clear={() => props.setSelectedItems(props.selectedItems.empty())}
        />
      </div>
    </div>
  );
}

function filteredList<T extends { id: number }>(
  allLanguages: List<T>,
  selectedLanguages: List<T>
) {
  return allLanguages.remove(selectedLanguages.map(lang => lang.id));
}

type IPropsLite<T extends { id: number }> = Omit<
  Omit<IProps<T>, "display">,
  "placeholder"
>;

export function LanguageMultiSelect(props: IPropsLite<ILanguage>) {
  const t = useContext(I18nContext);
  return (
    <ModelMultiSelect
      display={lang => lang.name}
      placeholder={t("Add_language")}
      {...props}
    />
  );
}

export function ClusterMultiSelect(props: IPropsLite<ICluster>) {
  const t = useContext(I18nContext);
  return (
    <ModelMultiSelect
      display={cluster => cluster.name}
      placeholder={t("Add_cluster")}
      {...props}
    />
  );
}
