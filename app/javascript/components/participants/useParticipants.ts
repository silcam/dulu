import { IParticipant, IParticipantInflated } from "../../models/Participant";
import List from "../../models/List";
import useAppSelector from "../../reducers/useAppSelector";

export default function useParticipants(
  filter: (p: IParticipant) => boolean = () => true
): List<IParticipantInflated> {
  const participants = useAppSelector(state => state.participants).filter(
    filter
  );
  const people = useAppSelector(state => state.people);
  const languages = useAppSelector(state => state.languages);
  const clusters = useAppSelector(state => state.clusters);

  return participants.mapToList(ptpt => {
    const clusterLang = ptpt.cluster_id
      ? { cluster: clusters.get(ptpt.cluster_id) }
      : { language: languages.get(ptpt.language_id!) };
    return {
      ...ptpt,
      ...clusterLang,
      person: people.get(ptpt.person_id)
    } as IParticipantInflated;
  });
}
