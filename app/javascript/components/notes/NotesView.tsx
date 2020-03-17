import React, { useState, useContext } from "react";
import { INote, NoteFor } from "../../models/Note";
import I18nContext from "../../contexts/I18nContext";
import PlusMinusButton from "../shared/PlusMinusButton";
import StyledTable from "../shared/StyledTable";
import useAppSelector from "../../reducers/useAppSelector";
import { fullName } from "../../models/Person";
import InlineAddIcon from "../shared/icons/InlineAddIcon";
import NoteForm from "./NoteForm";
import dateString from "../../util/dateString";
import useTranslation from "../../i18n/useTranslation";

interface IProps {
  notes: INote[];
  setNotes: (notes: INote[]) => void;
  noteFor: NoteFor;
  startExpanded?: boolean;
}

export default function NotesView(props: IProps) {
  const t = useContext(I18nContext);

  const people = useAppSelector(state => state.people);
  const user = useAppSelector(state => state.currentUser);

  const [expanded, setExpanded] = useState(!!props.startExpanded);
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingId, setEditingId] = useState(0);
  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <div style={{ marginBottom: "1em" }}>
      {props.notes.length > 0 && (
        <span>
          <PlusMinusButton
            isExpanded={expanded}
            handleClick={toggleExpanded}
            withCaret
          />{" "}
        </span>
      )}
      <span style={{ fontWeight: "bold" }}>{t("Notes")}</span>
      {props.notes.length > 0 && ` (${props.notes.length})`}
      <InlineAddIcon
        onClick={() => {
          setShowNewForm(true);
          setExpanded(true);
        }}
      />
      {expanded && (
        <StyledTable>
          <tbody>
            {showNewForm && (
              <tr>
                <NoteMeta
                  userName={fullName(user)}
                  date={new Date()}
                  canEdit={false}
                  edit={() => {}}
                />
                <td>
                  <NoteForm
                    noteFor={props.noteFor}
                    setNote={note => props.setNotes([note, ...props.notes])}
                    done={() => setShowNewForm(false)}
                  />
                </td>
              </tr>
            )}
            {props.notes.map(note => (
              <tr key={note.id}>
                <NoteMeta
                  userName={fullName(people.get(note.person_id))}
                  date={new Date(note.updated_at)}
                  canEdit={!!note.can.update}
                  edit={() => setEditingId(note.id)}
                />
                <td>
                  {note.id == editingId ? (
                    <NoteForm
                      note={note}
                      setNote={note =>
                        props.setNotes([
                          note,
                          ...props.notes.filter(n => n.id != note.id)
                        ])
                      }
                      done={() => setEditingId(0)}
                    />
                  ) : (
                    note.text
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      )}
    </div>
  );
}

function NoteMeta(props: {
  userName: string;
  date: Date;
  canEdit: boolean;
  edit: () => void;
}) {
  const t = useTranslation();

  return (
    <td className="subdued" style={{ width: "1%", whiteSpace: "nowrap" }}>
      {props.userName}
      <br />
      {dateString(
        props.date.toISOString().slice(0, 10),
        t("month_names_short")
      )}
      <br />
      {props.canEdit && (
        <button className="link" onClick={props.edit}>
          {t("Edit")}
        </button>
      )}
    </td>
  );
}
