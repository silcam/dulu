import React, { useContext, useState } from "react";
import BibleBook from "../../models/BibleBook";
import I18nContext from "../../application/I18nContext";
import DeleteIcon from "../shared/icons/DeleteIcon";
import { arrayDelete } from "../../util/arrayUtils";
import SelectInput from "../shared/SelectInput";
import AddIcon from "../shared/icons/AddIcon";

interface IProps {
  bookIds: number[];
  setBookIds: (b: number[]) => void;
}

export default function BooksSelector(props: IProps) {
  const t = useContext(I18nContext);
  const [adding, setAdding] = useState(false);
  const [addingId, setAddingId] = useState(0);
  const availableBookOptions = BibleBook.books(t)
    .filter(b => !props.bookIds.includes(b.id))
    .map(b => ({
      value: b.id,
      display: b.name
    }));

  const startAdding = () => {
    setAdding(true);
    setAddingId(availableBookOptions[0].value);
  };

  const add = () => {
    props.setBookIds(props.bookIds.concat([addingId]));
    setAdding(false);
    setAddingId(0);
  };

  return (
    <div>
      <div>
        {props.bookIds.map(id => (
          <span style={{ marginRight: "8px" }} key={id}>
            {BibleBook.name(id, t)}
            <DeleteIcon
              iconSize="small"
              onClick={() => props.setBookIds(arrayDelete(props.bookIds, id))}
            />
          </span>
        ))}
      </div>
      <div>
        {adding ? (
          <React.Fragment>
            <SelectInput
              value={addingId}
              options={availableBookOptions}
              handleChange={e => setAddingId(parseInt(e.target.value))}
              name="BibleBook"
              autoFocus
            />
            <button onClick={add}>{t("Add")}</button>
          </React.Fragment>
        ) : (
          <AddIcon onClick={startAdding} />
        )}
      </div>
    </div>
  );
}
