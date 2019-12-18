import React, { useContext, useState } from "react";
import { IPerson, fullName } from "../../models/Person";
import SearchTextInput from "../shared/SearchTextInput";
import I18nContext from "../../contexts/I18nContext";
import update from "immutability-helper";
import { emptyPerson } from "../../reducers/peopleReducer";
import { splitOnLastSpace, fixCaps } from "../../util/stringUtils";
import TextInput from "../shared/TextInput";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import FormGroup from "../shared/FormGroup";
import Spacer from "../shared/Spacer";
import useLoad from "../shared/useLoad";
import DuplicateWarning, { Duplicate } from "./DuplicateWarning";

interface IProps {
  value: IPerson | null;
  setValue: (p: IPerson | null) => void;
  placeholder?: string;
  autoClear?: boolean;
  autoFocus?: boolean;
}

interface NewPerson {
  first_name: string;
  last_name: string;
  not_a_duplicate?: boolean;
}

export default function PersonPicker(props: IProps) {
  const t = useContext(I18nContext);

  const [newPerson, setNewPerson] = useState<NewPerson>({
    first_name: "",
    last_name: ""
  });
  const [duplicates, setDuplicates] = useState<Duplicate[] | null>(null);
  const [newPersonForm, setNewPersonForm] = useState(false);
  const newPersonValid =
    newPerson.first_name.length > 0 &&
    newPerson.last_name.length > 0 &&
    (!duplicates || newPerson.not_a_duplicate);
  const [load, loading] = useLoad();

  const save = async () => {
    const data = await load(duluAxios =>
      duluAxios.post("/api/people", { person: newPerson })
    );
    if (data) {
      if (data.person) {
        props.setValue(data.person);
        setNewPersonForm(false);
      } else {
        setDuplicates(data.duplicates);
      }
    }
  };

  return newPersonForm ? (
    <div>
      <FormGroup label={t("New_person")}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <TextInput
            value={newPerson.first_name}
            setValue={first_name => setNewPerson({ ...newPerson, first_name })}
            placeholder={t("First_name")}
          />
          <Spacer width="20px" />
          <TextInput
            value={newPerson.last_name}
            setValue={last_name => setNewPerson({ ...newPerson, last_name })}
            placeholder={t("Last_name")}
          />
        </div>
      </FormGroup>
      {duplicates && (
        <DuplicateWarning
          duplicates={duplicates}
          newPerson={newPerson}
          setNewPerson={setNewPerson}
        />
      )}
      <SmallSaveAndCancel
        handleSave={save}
        saveDisabled={!newPersonValid}
        saveInProgress={loading}
        handleCancel={() => setNewPersonForm(false)}
      />
    </div>
  ) : (
    <SearchTextInput
      queryPath="/api/people/search"
      placeholder={
        props.placeholder === undefined ? t("Name") : props.placeholder
      }
      updateValue={searchItem =>
        props.setValue(
          searchItem.id ? update(emptyPerson, { $merge: searchItem }) : null
        )
      }
      text={props.value ? fullName(props.value) : ""}
      autoFocus={props.autoFocus}
      addBox={props.autoClear}
      notListed={{
        label: t("Add_person"),
        onClick: name => {
          const names = splitOnLastSpace(name).map(fixCaps);
          setNewPerson({ first_name: names[0], last_name: names[1] });
          setNewPersonForm(true);
        }
      }}
      allowBlank
    />
  );
}
