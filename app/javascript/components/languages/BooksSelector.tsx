import React, { useContext, useState } from "react";
import BibleBook from "../../models/BibleBook";
import I18nContext from "../../contexts/I18nContext";
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
  const [addingIndex, setAddingIndex] = useState(0);
  const availableBookOptions = BibleBook.books(t)
    .filter(b => !props.bookIds.includes(b.id))
    .map((b, index) => ({
      id: b.id,
      display: b.name,
      value: `${index}`
    }));

  const startAdding = () => {
    setAdding(true);
  };

  const add = () => {
    const addingId = availableBookOptions[addingIndex].id;
    props.setBookIds(props.bookIds.concat([addingId]));

    if (addingIndex == availableBookOptions.length - 1)
      setAddingIndex(addingIndex - 1);
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
              value={`${addingIndex}`}
              options={availableBookOptions}
              setValue={index => setAddingIndex(parseInt(index))}
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
