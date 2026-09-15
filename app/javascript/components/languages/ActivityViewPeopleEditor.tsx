import React, { useState, useContext } from "react";
import I18nContext from "../../contexts/I18nContext";
import { fullName } from "../../models/Person";
import { IActivity } from "../../models/Activity";
import Participant from "../../models/Participant";
import DeleteIcon from "../shared/icons/DeleteIcon";
import update from "immutability-helper";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import Language, { ILanguage } from "../../models/Language";
import SelectInput from "../shared/SelectInput";
import { subtract } from "../../util/arrayUtils";
import useLoad, { useLoadOnMount } from "../shared/useLoad";
import useAppSelector from "../../reducers/useAppSelector";

interface IProps {
  cancelEdit: () => void;
  activity: IActivity;
  language: ILanguage;
  basePath: string;
}

export default function ActivityViewPeopleEditor(props: IProps) {
  const t = useContext(I18nContext);
  const [saveLoad, saving] = useLoad();

  const participants = useAppSelector(state => state.participants);
  const people = useAppSelector(state => state.people);

  // Make sure all ptpts for language are loaded
  useLoadOnMount(`/api/languages/${props.language.id}/participants`, [
    props.language.id
  ]);

  const [draftPtptIds, setDraftPtptIds] = useState(
    props.activity.participant_ids
  );

  const draftPtptPeople = Participant.participantPeople(
    draftPtptIds,
    participants,
    people
  );
  const availablePtptIds = subtract(
    Language.participants(
      participants,
      props.language.id,
      props.language.cluster_id
    ).map(ptpt => ptpt.id),
    draftPtptIds
  );
  const availablePtptPeople = Participant.participantPeople(
    availablePtptIds,
    participants,
    people
  );

  // The user's pick is state; whether it is still *offered* is a calculation, so it
  // is derived here rather than corrected afterwards by an effect. Undefined if the
  // available list is empty.
  //
  // This used to be `useState(availablePtptIds[0])` plus a dependency-less effect
  // that re-selected the first entry whenever the pick fell out of the list. The
  // effect was not synchronising with anything: it existed because useState reads
  // its argument only on the *first* render, and on that render the participants
  // fetched by useLoadOnMount above have not arrived, so the initial value was
  // always undefined. Correcting it in an effect meant one render where the data had
  // arrived and the dropdown was still hidden -- which is what the guard below,
  // whose second condition was added to work around exactly that, is about -- and it
  // re-ran after every render, having no dependency array to compare.
  const [chosenPtptId, setChosenPtptId] = useState<number | undefined>();
  const addPtptId =
    chosenPtptId !== undefined && availablePtptIds.includes(chosenPtptId)
      ? chosenPtptId
      : availablePtptIds[0];

  const save = async () => {
    const data = await saveLoad(duluAxios =>
      duluAxios.put(`/api/activities/${props.activity.id}`, {
        activity: {
          participant_ids: draftPtptIds
        }
      })
    );
    if (data) props.cancelEdit();
  };

  return (
    <div>
      <table style={{ width: "auto" }}>
        <tbody>
          {draftPtptPeople!.map((ptptPerson, index) => (
            <tr key={ptptPerson.participant.id}>
              <td>{fullName(ptptPerson.person)}</td>
              <td>
                <DeleteIcon
                  onClick={() =>
                    setDraftPtptIds(
                      update(draftPtptIds, {
                        $splice: [[index, 1]]
                      }) as number[]
                    )
                  }
                />
              </td>
            </tr>
          ))}
          {/* Only need to check both because of tests where Edit gets clicked before ptpts are loaded} */}
          {availablePtptPeople.length > 0 && addPtptId && (
            <tr>
              <td colSpan={2}>
                <SelectInput
                  options={availablePtptPeople.map(ptptPerson => ({
                    value: `${ptptPerson.participant.id}`,
                    display: fullName(ptptPerson.person)
                  }))}
                  value={`${addPtptId}`}
                  setValue={id => setChosenPtptId(parseInt(id))}
                />
                <button
                  onClick={() =>
                    setDraftPtptIds(draftPtptIds.concat([addPtptId]))
                  }
                >
                  {t("Add")}
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <SmallSaveAndCancel
        handleSave={save}
        handleCancel={props.cancelEdit}
        saveInProgress={saving}
      />
    </div>
  );
}
