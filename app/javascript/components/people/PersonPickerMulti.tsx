import React, { useContext } from "react";
import { IPerson, fullName } from "../../models/Person";
import MultiSelectItemList from "../shared/MultiSelectItemList";
import PersonPicker from "./PersonPicker";
import I18nContext from "../../contexts/I18nContext";

interface IProps {
  people: IPerson[];
  setPeople: (p: IPerson[]) => void;
}

export default function PersonPickerMulti(props: IProps) {
  const t = useContext(I18nContext);

  return (
    <div>
      <MultiSelectItemList
        items={props.people}
        display={person => fullName(person)}
        removeItem={person =>
          props.setPeople(props.people.filter(p => p.id != person.id))
        }
      />
      <PersonPicker
        value={null}
        setValue={person =>
          person && props.setPeople([...props.people, person])
        }
        placeholder={t("Add_person")}
        autoClear
      />
    </div>
  );
}
