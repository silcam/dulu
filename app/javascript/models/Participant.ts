import { Person } from "./Person";
import { ICluster } from "./Cluster";
import { BasicModel } from "./BasicModel";
import { ById } from "./TypeBucket";

export interface IParticipant {
  id: number;
  person_id: number;
  cluster_id?: number;
  language_id?: number;
  roles: string[];
  start_date: string;
  end_date?: string;
}

export interface IParticipantInflated extends IParticipant {
  person: Person;
  cluster?: ICluster;
  language?: BasicModel;
}

function clusterProgram(participant: IParticipantInflated) {
  return participant.cluster ? participant.cluster : participant.language;
}

interface PtptPerson {
  participant: IParticipant;
  person: Person;
}
function participantPeople(
  ids: number[],
  participants: ById<IParticipant>,
  people: ById<Person>
) {
  return ids.reduce((accum: PtptPerson[], id) => {
    const ptpt = participants[id];
    if (!ptpt) return accum;
    const person = people[ptpt.person_id];
    if (!person) return accum;
    return accum.concat([{ participant: ptpt, person: person }]);
  }, []);
}

export default {
  clusterProgram,
  participantPeople
};
