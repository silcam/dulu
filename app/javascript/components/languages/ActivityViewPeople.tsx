import React, { useState, useContext } from "react";
import I18nContext from "../../contexts/I18nContext";
import Spacer from "../shared/Spacer";
import EditIcon from "../shared/icons/EditIcon";
import styles from "./ActivityView.css";
import { Link } from "react-router-dom";
import { fullName } from "../../models/Person";
import CommaList from "../shared/CommaList";
import { IActivity } from "../../models/Activity";
import Participant from "../../models/Participant";
import { ILanguage } from "../../models/Language";
import ActivityViewPeopleEditor from "./ActivityViewPeopleEditor";
import useAppSelector from "../../reducers/useAppSelector";

export interface IProps {
  activity: IActivity;
  language: ILanguage;
  basePath: string;
}

export default function ActivityViewPeople(props: IProps) {
  const t = useContext(I18nContext);
  const [editing, setEditing] = useState(false);
  const edit = () => setEditing(true);
  const cancelEdit = () => setEditing(false);

  const participants = useAppSelector(state => state.participants);
  const people = useAppSelector(state => state.people);

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
            participants,
            people
          ).map(ptptPerson => (
            <li key={ptptPerson.participant.id}>
              <Link
                to={`${props.basePath}/participants/${ptptPerson.participant.id}`}
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
