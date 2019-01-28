export default class Participant {
  static clusterProgram(participant) {
    return participant.cluster ? participant.cluster : participant.language;
  }
}
