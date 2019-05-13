import { IPerson } from "./Person";
import { ICluster } from "./Cluster";
import { BasicModel } from "./BasicModel";
import List from "./List";
import { ICan } from "../actions/canActions";

export interface IParticipant {
  id: number;
  person_id: number;
  cluster_id?: number;
  language_id?: number;
  roles: string[];
  start_date: string;
  end_date?: string;
  can: ICan;
}

export interface IParticipantInflated extends IParticipant {
  person: IPerson;
  cluster?: ICluster;
  language?: BasicModel;
}

function clusterProgram(participant: IParticipantInflated) {
  return participant.cluster ? participant.cluster : participant.language;
}

interface PtptPerson {
  participant: IParticipant;
  person: IPerson;
}
function participantPeople(
  ids: number[],
  participants: List<IParticipant>,
  people: List<IPerson>
): PtptPerson[] {
  return ids
    .map(id => {
      const ptpt = participants.get(id);
      return {
        person: people.get(ptpt.person_id),
        participant: ptpt
      };
    })
    .filter(p => p.participant.id > 0 && p.person.id > 0);
}
// function participantPeople(
//   ids: number[],
//   participants: List<IParticipant>,
//   people: List<IPerson>
// ) {
//   return ids.reduce((accum: PtptPerson[], id) => {
//     const ptpt = participants.get(id);
//     if (!ptpt) return accum;
//     const person = people.get(ptpt.person_id);
//     if (!person) return accum;
//     return accum.concat([{ participant: ptpt, person: person }]);
//   }, []);
// }

export default {
  clusterProgram,
  participantPeople
};
