import React, { useContext } from "react";
import CommaList from "../shared/CommaList";
import { Link } from "react-router-dom";
import DeleteIcon from "../shared/icons/DeleteIcon";
import { deleteFrom } from "../../util/arrayUtils";
import { ICluster } from "../../models/Cluster";
import { ILanguage } from "../../models/Language";
import { IRegionInflated, IRegion } from "../../models/Region";
import { ById, Partial } from "../../models/TypeBucket";
import I18nContext from "../../contexts/I18nContext";
import { SearchPickerAutoClear } from "../shared/SearchPicker";

type ClusterLanguage = ICluster | ILanguage;

interface IProps<T extends ClusterLanguage> {
  thing: "cluster" | "language";
  region: IRegionInflated;
  editing?: boolean;
  updateRegion: (r: Partial<IRegion>) => void;
  noTrash?: boolean;
  collection: ById<T>;
}

export default function ProgramList<T extends ClusterLanguage>(
  props: IProps<T>
) {
  const things = plural(props.thing) as ("clusters" | "languages");
  const list = props.region[things] as T[];
  const t = useContext(I18nContext);

  const addThing = (clusterLanguage: T) => {
    props.updateRegion({
      [things]: [clusterLanguage].concat(list)
    });
  };

  const removeThing = (id: number) => {
    props.updateRegion({
      [things]: deleteFrom(list, id)
    });
  };

  return props.editing ? (
    <div>
      <label>{t(capitalize(things))}</label>
      <table>
        <tbody>
          <tr>
            <td colSpan={2}>
              <SearchPickerAutoClear
                collection={props.collection}
                setSelected={addThing}
                placeholder={t(`Add_${props.thing}`)}
              />
            </td>
          </tr>
          {list.map(thing => (
            <tr key={thing.id}>
              <td>{thing.name}</td>
              <td>
                {!props.noTrash && (
                  <DeleteIcon onClick={() => removeThing(thing.id)} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div>
      <label>{t(capitalize(things))}</label>
      <p>
        <CommaList
          list={list}
          render={item => <Link to={url(things, item.id)}>{item.name}</Link>}
        />
      </p>
    </div>
  );
}

function url(things: string, id: number) {
  return `/${things}/${id}`;
}

function capitalize(word: string) {
  return word.slice(0, 1).toUpperCase() + word.slice(1);
}

function plural(thing: string) {
  return thing + "s";
}
