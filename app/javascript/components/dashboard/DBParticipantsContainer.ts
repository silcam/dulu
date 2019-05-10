import { AppState } from "../../reducers/appReducer";
import Language from "../../models/Language";
import DBParticipantsTable from "./DBParticipantsTable";
import { personCompare, IPerson } from "../../models/Person";
import { addPeople } from "../../actions/peopleActions";
import { addParticipants } from "../../actions/participantActions";
import { connect } from "react-redux";
import { IParticipant } from "../../models/Participant";
import { flat } from "../../util/arrayUtils";

interface IProps {
  languageIds: number[];
}

interface ProgramParticipant extends IParticipant {
  program: { name: string; path: string };
}

export interface PeopleParticipants {
  people: IPerson[];
  participants: { [personId: string]: ProgramParticipant[] };
}

const mapStateToProps = (state: AppState, ownProps: IProps) => {
  const participants = flat(
    ownProps.languageIds
      .map(id => state.languages.get(id))
      .map(lang =>
        Language.participants(state.participants, lang.id, lang.cluster_id)
      )
  );
  const peopleParticipants = participants.reduce(
    (accum: PeopleParticipants, ptpt) => {
      if (accum.participants[ptpt.person_id] === undefined) {
        accum.people.push(state.people.get(ptpt.person_id));
        accum.participants[ptpt.person_id] = [];
      }
      if (!accum.participants[ptpt.person_id].some(p => p.id == ptpt.id)) {
        const program = ptpt.language_id
          ? {
              name: state.languages.get(ptpt.language_id).name,
              path: `/languages/${ptpt.language_id}`
            }
          : {
              name: state.clusters.get(ptpt.cluster_id!).name,
              path: `/clusters/${ptpt.cluster_id}`
            };
        const programParticipant = { ...ptpt, program: program };
        accum.participants[ptpt.person_id].push(programParticipant);
      }
      return accum;
    },
    { people: [], participants: {} }
  );
  peopleParticipants.people.sort(personCompare);
  return peopleParticipants;
};

const mapDispatchToProps = {
  addPeople: addPeople,
  addParticipants: addParticipants
};

const DBParticipantsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DBParticipantsTable);

export default DBParticipantsContainer;
