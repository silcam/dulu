import { findById } from "../util/arrayUtils";
import Activity from "./Activity";

export default class Participant {
  static clusterProgram(participant) {
    return participant.cluster ? participant.cluster : participant.language;
  }

  static participantsForActivity(language, activity) {
    return activity.participant_ids.map(id =>
      findById(language.participants, id)
    );
  }

  static activitiesForParticipant(language, participant) {
    return participant.activity_ids
      .map(id => Activity.findActivity(language, id))
      .filter(activity => activity != undefined)
      .sort(Activity.compare);
  }
}
