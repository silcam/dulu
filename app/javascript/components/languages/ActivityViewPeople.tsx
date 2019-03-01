import React, { useState, useContext } from "react";
import { ById } from "../../models/TypeBucket";
import I18nContext from "../../application/I18nContext";
import Spacer from "../shared/Spacer";
import EditIcon from "../shared/icons/EditIcon";
import styles from "./ActivityView.css";
import { Link } from "react-router-dom";
import { IPerson, fullName } from "../../models/Person";
import CommaList from "../shared/CommaList";
import { IActivity } from "../../models/Activity";
import Participant, { IParticipant } from "../../models/Participant";
import { ActionPack } from "../../util/useAPI";
import { ILanguage } from "../../models/Language";
import ActivityViewPeopleEditor from "./ActivityViewPeopleEditor";

interface IProps {
  activity: IActivity;
  language: ILanguage;
  participants: ById<IParticipant>;
  people: ById<IPerson>;
  basePath: string;
  actions: ActionPack;
}

export default function ActivityViewPeople(props: IProps) {
  const t = useContext(I18nContext);
  const [editing, setEditing] = useState(false);
  const edit = () => setEditing(true);
  const cancelEdit = () => setEditing(false);

  return (
    <div>
      <h3>
        {t("People")}
        <Spacer width="10px" />
        {props.activity.can.update && <EditIcon onClick={edit} />}
      </h3>
      {editing ? (
        <ActivityViewPeopleEditor {...props} cancelEdit={cancelEdit} />
      ) : (
        <ul className={styles.stdList}>
          {Participant.participantPeople(
            props.activity.participant_ids,
            props.participants,
            props.people
          ).map(ptptPerson => (
            <li key={ptptPerson.participant.id}>
              <Link
                to={`${props.basePath}/participants/${
                  ptptPerson.participant.id
                }`}
              >
                {fullName(ptptPerson.person)}
              </Link>
              {" - "}
              <CommaList
                list={ptptPerson.participant.roles}
                render={role => t(`roles.${role}`)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
