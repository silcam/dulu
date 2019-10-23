import React, { useContext, useState } from "react";
import { IActivity, IStage } from "../../models/Activity";
import I18nContext from "../../contexts/I18nContext";
import EditIcon from "../shared/icons/EditIcon";
import DeleteIcon from "../shared/icons/DeleteIcon";
import FuzzyDateInput from "../shared/FuzzyDateInput";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import DuluAxios from "../../util/DuluAxios";
import Loading from "../shared/Loading";
import { Setter } from "../../models/TypeBucket";

interface IProps {
  activity: IActivity;
  setActivity: Setter<IActivity>;
}

export default function ActivityViewStages(props: IProps) {
  const t = useContext(I18nContext);

  const [editId, setEditId] = useState(0);
  const [draftDate, setDraftDate] = useState("");
  const [loading, setLoading] = useState(false);

  const editStage = (stage: IStage) => {
    setDraftDate(stage.start_date);
    setEditId(stage.id);
  };

  const updateStage = async (stage: IStage) => {
    setLoading(true);
    const data = await DuluAxios.put(`/api/stages/${stage.id}`, {
      stage: { ...stage, start_date: draftDate }
    });
    if (data) {
      props.setActivity(data.activity);
      setEditId(0);
    }
    setLoading(false);
  };

  const deleteStage = async (stage: IStage) => {
    if (
      confirm(t("confirm_delete", { name: t(`stage_names.${stage.name}`) }))
    ) {
      setLoading(true);
      const data = await DuluAxios.delete(`/api/stages/${stage.id}`);
      if (data) {
        props.setActivity(data.activity);
      }
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>{t("History")}</h3>
      {loading && <Loading />}
      <table style={{ width: "auto" }}>
        <tbody>
          {props.activity.stages.map(stage => (
            <tr key={stage.id}>
              <td>{t(`stage_names.${stage.name}`)}</td>
              <td>
                {editId === stage.id ? (
                  <FuzzyDateInput
                    date={draftDate}
                    handleDateInput={setDraftDate}
                  />
                ) : (
                  stage.start_date
                )}
              </td>
              {props.activity.can.update &&
                (editId === stage.id ? (
                  <td>
                    <SmallSaveAndCancel
                      handleCancel={() => setEditId(0)}
                      handleSave={() => updateStage(stage)}
                    />
                  </td>
                ) : (
                  <td>
                    <EditIcon onClick={() => editStage(stage)} />
                    <DeleteIcon onClick={() => deleteStage(stage)} />
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
