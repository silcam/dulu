import React from "react";
import PropTypes from "prop-types";
import CommaList from "../shared/CommaList";
import { Link } from "react-router-dom";
import SearchTextInput from "../shared/SearchTextInput";
import DeleteIcon from "../shared/icons/DeleteIcon";
import { deleteFrom } from "../../util/arrayUtils";

export default function ProgramList(props) {
  const things = plural(props.thing);
  const list = props.region[things];

  const addThing = thing => {
    props.updateRegion({
      [things]: [thing].concat(list)
    });
  };

  const removeThing = id => {
    props.updateRegion({
      [things]: deleteFrom(list, id)
    });
  };

  const t = props.t;

  return props.editing ? (
    <div>
      <label>{t(capitalize(things))}</label>
      <table>
        <tbody>
          <tr>
            <td colSpan="2">
              <SearchTextInput
                queryPath={`/api/${things}/search`}
                text=""
                placeholder={t(`Add_${props.thing}`)}
                updateValue={addThing}
                addBox
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

function url(things, id) {
  return `/${things}/${id}`;
}

function capitalize(word) {
  return word.slice(0, 1).toUpperCase() + word.slice(1);
}

function plural(thing) {
  return thing + "s";
}

ProgramList.propTypes = {
  editing: PropTypes.bool,
  region: PropTypes.object.isRequired,
  thing: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  updateRegion: PropTypes.func.isRequired,
  noTrash: PropTypes.bool
};
