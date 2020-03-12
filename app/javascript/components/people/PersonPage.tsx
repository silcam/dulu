import React, { useState, useContext } from "react";
import EditActionBar from "../shared/EditActionBar";
import TextOrEditText from "../shared/TextOrEditText";
import SaveIndicator from "../shared/SaveIndicator";
import PersonBasicInfo from "./PersonBasicInfo";
import DangerButton from "../shared/DangerButton";
import { fullName, IPerson } from "../../models/Person";
import update from "immutability-helper";
import ParticipantsTable from "./ParticipantsTable";
import DuluAxios from "../../util/DuluAxios";
import RolesTable from "./RolesTable";
import Loading from "../shared/Loading";
import OrgPeopleContainer from "./OrgPeopleContainer";
import PersonEventsContainer from "./PersonEventsContainer";
import { Locale, T } from "../../i18n/i18n";
import { History } from "history";
import DuluSettings from "./DuluSettings";
import useLoad, { useLoadOnMount } from "../shared/useLoad";
import useAppSelector from "../../reducers/useAppSelector";
import I18nContext from "../../contexts/I18nContext";
import { useDispatch } from "react-redux";
import {
  deletePerson as deletePersonAction,
  setPerson
} from "../../actions/peopleActions";
// import styles from "./PersonPage.css";

interface IProps {
  id: number;
  updateLanguage: (locale: Locale) => void;
  history: History;
}

interface IState {
  person?: IPerson;
  editing?: boolean;
  saving?: boolean;
  deleting?: boolean;
  savedChanges?: boolean;
  edited?: boolean;
}

export default function PersonPage(props: IProps) {
  const t = useContext(I18nContext);
  const dispatch = useDispatch();
  const [saveLoad] = useLoad();
  const propsPerson = useAppSelector(state => state.people.get(props.id));

  const [state, _setState] = useState<IState>({});
  const setState = (stateUpdate: Partial<IState>) =>
    _setState({ ...state, ...stateUpdate });

  useLoadOnMount(`/api/people/${props.id}`);

  const edit = () =>
    setState({
      editing: true,
      savedChanges: false,
      edited: false,
      person: { ...propsPerson }
    });

  const cancelEdit = () => setState({ editing: false, person: undefined });

  const updatePerson = (mergePerson: Partial<IPerson>) => {
    setState({
      edited: true,
      person: update(state.person, { $merge: mergePerson })
    });
  };

  const validate = (person: IPerson | undefined = state.person) => {
    return (
      person &&
      person.first_name.length > 0 &&
      person.last_name.length > 0 &&
      (!person.has_login || person.email.length > 0)
    );
  };

  const setStateAfterSave = () => {
    setState({
      editing: false,
      edited: false,
      saving: false,
      savedChanges: true,
      person: undefined
    });
  };

  const save = async (person: IPerson | undefined = state.person) => {
    if (!person || !validate(person)) return;
    saveLoad(async duluAxios => {
      const data = await duluAxios.put(`/api/people/${person.id}`, { person });
      if (data) {
        setStateAfterSave();
        updateLanguageIfNecessary(data.people[0]);
      }
      return data;
    });
  };

  const updatePersonAndSave = (mergePerson: Partial<IPerson>) => {
    const newPerson = update(propsPerson, { $merge: mergePerson });
    setState({
      person: newPerson
    });
    save(newPerson);
  };

  const updateLanguageIfNecessary = (person: IPerson) => {
    if (person.isUser && person.ui_language != t.locale)
      props.updateLanguage(person.ui_language);
  };

  const deletePerson = async () => {
    const success = await DuluAxios.delete(`/api/people/${propsPerson.id}`);
    if (success) {
      props.history.push("/people");
      dispatch(deletePersonAction(propsPerson.id));
    }
  };

  const replaceRoles = (newRoles: string[]) => {
    const newPerson = update(propsPerson, {
      roles: { $set: newRoles }
    });
    setState({
      person: newPerson
    });
    dispatch(setPerson(newPerson));
  };

  const person = state.editing ? state.person : propsPerson;

  if (!person || person.id == 0) return <Loading />;

  return (
    <div className="padBottom">
      <EditActionBar
        can={person.can}
        editing={state.editing}
        saveDisabled={!state.edited || !validate()}
        edit={edit}
        delete={() => setState({ deleting: true })}
        save={() => save()}
        cancel={cancelEdit}
      />

      {state.deleting && (
        <DangerButton
          handleClick={deletePerson}
          handleCancel={() => setState({ deleting: false })}
          message={t("delete_person_warning", {
            name: fullName(person)
          })}
          buttonText={t("delete_person", {
            name: fullName(person)
          })}
        />
      )}

      <SaveIndicator saving={state.saving} saved={state.savedChanges} />

      <h2>
        <TextOrEditText
          editing={state.editing}
          name="first_name"
          value={person.first_name}
          setValue={value => updatePerson({ first_name: value })}
          validateNotBlank
        />
        {!state.editing && " "}
        <TextOrEditText
          editing={state.editing}
          name="last_name"
          value={person.last_name}
          setValue={value => updatePerson({ last_name: value })}
          validateNotBlank
        />
      </h2>

      <PersonBasicInfo
        person={person}
        editing={state.editing}
        updatePerson={updatePerson}
      />

      <OrgPeopleContainer person={person} />

      <RolesTable person={person} replaceRoles={replaceRoles} />

      <ParticipantsTable person={person} />

      <PersonEventsContainer
        person={person}
        history={props.history}
        basePath={`/people/${props.id}`}
      />

      {person.isUser && !state.editing && (
        <DuluSettings
          person={person}
          updatePersonAndSave={updatePersonAndSave}
        />
      )}
    </div>
  );
}
