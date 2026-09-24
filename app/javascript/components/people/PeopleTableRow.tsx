import React from "react";
import styles from "../shared/MasterDetail.css";
import { useNavigate } from "react-router-dom";
import { IPerson } from "../../models/Person";

export default PeopleTableRow;

interface IProps {
  person: IPerson;
  selected?: boolean;
}

function PeopleTableRow(props: IProps) {
  const navigate = useNavigate();
  const person = props.person;
  const rowClass = props.selected ? styles.selected : "";
  return (
    <tr
      className={rowClass}
      onClick={() => navigate(`/people/${person.id}`)}
    >
      <td>{`${person.last_name}, ${person.first_name}`}</td>
      {/* <td>
        <StyledText styleClass="subdued">
          {person.organizations
            .map(org => {
              return org.name;
            })
            .join(", ")}
        </StyledText>
      </td> */}
    </tr>
  );
}
