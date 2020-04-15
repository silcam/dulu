import Language from "../../models/Language";
import { IPerson } from "../../models/Person";
import { IParticipant } from "../../models/Participant";
import { flat } from "../../util/arrayUtils";
import useAppSelector from "../../reducers/useAppSelector";

interface ProgramParticipant extends IParticipant {
  program: { name: string; path: string };
}

export interface PeopleParticipants {
  people: IPerson[];
  participants: { [personId: string]: ProgramParticipant[] };
}

export default function usePeopleParticipants(
  languageIds: number[]
): PeopleParticipants {
  const allLanguages = useAppSelector(state => state.languages);
  const allClusters = useAppSelector(state => state.clusters);
  const allPeople = useAppSelector(state => state.people);
  const allParticipants = useAppSelector(state => state.participants);
  const languages = allLanguages.filter(lang => languageIds.includes(lang.id));

  const participants = flat(
    languages.map(lang =>
      Language.participants(allParticipants, lang.id, lang.cluster_id).toArray()
    )
  );

  const peopleParticipants = participants.reduce(
    (accum: PeopleParticipants, ptpt) => {
      if (accum.participants[ptpt.person_id] === undefined) {
        accum.people.push(allPeople.get(ptpt.person_id));
        accum.participants[ptpt.person_id] = [];
      }
      if (!accum.participants[ptpt.person_id].some(p => p.id == ptpt.id)) {
        const program = ptpt.language_id
          ? {
              name: allLanguages.get(ptpt.language_id).name,
              path: `/languages/${ptpt.language_id}`
            }
          : {
              name: allClusters.get(ptpt.cluster_id!).name,
              path: `/clusters/${ptpt.cluster_id}`
            };
        const programParticipant = { ...ptpt, program: program };
        accum.participants[ptpt.person_id].push(programParticipant);
      }
      return accum;
    },
    { people: [], participants: {} }
  );

  return peopleParticipants;
}
