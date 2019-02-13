export const ADD_ACTIVITIES = "ADD_ACTIVITIES";
export const SET_ACTIVITY = "SET_ACTIVITY";
export const DELETE_WORKSHOP_EVENT = "DELETE_WORKSHOP_EVENT";

export function addActivities(activities) {
  return {
    type: ADD_ACTIVITIES,
    activities: activities
  };
}

export function setActivity(activity) {
  return {
    type: SET_ACTIVITY,
    activity: activity
  };
}

export function deleteWorkshopEvent(activityId, workshopId) {
  return {
    type: DELETE_WORKSHOP_EVENT,
    activityId,
    workshopId
  };
}
