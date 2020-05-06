import React, { useState, useContext } from "react";
import EditActionBar from "../shared/EditActionBar";
import TextOrEditText from "../shared/TextOrEditText";
import SaveIndicator from "../shared/SaveIndicator";
import PersonBasicInfo from "./PersonBasicInfo";
import DangerButton from "../shared/DangerButton";
import { fullName, IPerson } from "../../models/Person";
import update from "immutability-helper";
import ParticipantsTable from "./ParticipantsTable";
import RolesTable from "./RolesTable";
import Loading from "../shared/Loading";
import PersonEventsContainer from "./PersonEventsContainer";
import DuluSettings from "./DuluSettings";
import useLoad, { useLoadOnMount } from "../shared/useLoad";
import useAppSelector from "../../reducers/useAppSelector";
import I18nContext from "../../contexts/I18nContext";
import { useDispatch } from "react-redux";
// import styles from "./PersonPage.css";
import { useHistory } from "react-router-dom";
import { setCurrentUserAction } from "../../reducers/currentUserReducer";
import MyOrganizationsTable from "./MyOrganizationsTable";

export interface PersonPageProps {
  id: number;
}

interface IState {
  person?: IPerson;
  editing?: boolean;
  saving?: boolean;
  deleting?: boolean;
  savedChanges?: boolean;
  edited?: boolean;
}

export default function PersonPage(props: PersonPageProps) {
  const t = useContext(I18nContext);
  const dispatch = useDispatch();
  const history = useHistory();
  const [saveLoad] = useLoad();
  const propsPerson = useAppSelector(state => state.people.get(props.id));
  const user = useAppSelector(state => state.currentUser);

  const [state, _setState] = useState<IState>({});
  const setState = (stateUpdate: Partial<IState>) =>
    _setState({ ...state, ...stateUpdate });

  useLoadOnMount(`/api/people/${props.id}`, [props.id]);

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
        updateUserIfNecessary(data.people[0]);
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

  const updateUserIfNecessary = (person: IPerson) => {
    if (user.id == person.id) {
      dispatch(setCurrentUserAction(person));
    }
  };

  const deletePerson = async () => {
    const success = await saveLoad(duluAxios =>
      duluAxios.delete(`/api/people/${propsPerson.id}`)
    );
    if (success) history.push("/people");
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

      {!state.editing && (
        <React.Fragment>
          <MyOrganizationsTable person={person} />

          <RolesTable person={person} />

          <ParticipantsTable person={person} />
        </React.Fragment>
      )}

      <PersonEventsContainer
        person={person}
        history={history}
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
