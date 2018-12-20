import update from "immutability-helper";
import { findIndexById } from "../util/arrayUtils";

export default class Workshop {
  static refresh(language, workshop) {
    const activityIndex = findIndexById(
      language.workshops_activities,
      workshop.activityId
    );
    const workshopIndex = findIndexById(
      language.workshops_activities[activityIndex].workshops,
      workshop.id
    );
    return update(language, {
      workshops_activities: {
        [activityIndex]: {
          workshops: {
            [workshopIndex]: {
              $set: workshop
            }
          }
        }
      }
    });
  }
}
