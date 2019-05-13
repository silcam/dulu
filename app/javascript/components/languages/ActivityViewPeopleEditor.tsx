import React, { useState, useContext, useEffect } from "react";
import I18nContext from "../../contexts/I18nContext";
import { IPerson, fullName } from "../../models/Person";
import { IActivity } from "../../models/Activity";
import Participant, { IParticipant } from "../../models/Participant";
import DeleteIcon from "../shared/icons/DeleteIcon";
import update from "immutability-helper";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import { useAPIPut, ActionPack, useAPIGet } from "../../util/useAPI";
import Language, { ILanguage } from "../../models/Language";
import SelectInput from "../shared/SelectInput";
import { subtract } from "../../util/arrayUtils";
import List from "../../models/List";

interface IProps {
  cancelEdit: () => void;
  activity: IActivity;
  language: ILanguage;
  participants: List<IParticipant>;
  people: List<IPerson>;
  basePath: string;
  actions: ActionPack;
}

export default function ActivityViewPeopleEditor(props: IProps) {
  const t = useContext(I18nContext);

  // Make sure all ptpts for language are loaded
  useAPIGet(
    `/api/languages/${props.language.id}/participants`,
    {},
    props.actions,
    []
  );

  const [draftPtptIds, setDraftPtptIds] = useState(
    props.activity.participant_ids
  );

  const draftPtptPeople = Participant.participantPeople(
    draftPtptIds,
    props.participants,
    props.people
  );
  const availablePtptIds = subtract(
    Language.participants(
      props.participants,
      props.language.id,
      props.language.cluster_id
    ).map(ptpt => ptpt.id),
    draftPtptIds
  );
  const availablePtptPeople = Participant.participantPeople(
    availablePtptIds,
    props.participants,
    props.people
  );

  const [addPtptId, setAddPtptId] = useState(availablePtptIds[0]); // Undef if list is empty
  useEffect(() => {
    if (availablePtptIds.length > 0 && !availablePtptIds.includes(addPtptId))
      setAddPtptId(availablePtptIds[0]);
  });

  const [saving, save] = useAPIPut(
    `/api/activities/${props.activity.id}`,
    {
      activity: {
        participant_ids: draftPtptIds
      }
    },
    props.actions
  );

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
                    setDraftPtptIds(update(draftPtptIds, {
                      $splice: [[index, 1]]
                    }) as number[])
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
                  setValue={id => setAddPtptId(parseInt(id))}
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
        handleSave={() => save(props.cancelEdit)}
        handleCancel={props.cancelEdit}
        saveInProgress={saving}
      />
    </div>
  );
}
