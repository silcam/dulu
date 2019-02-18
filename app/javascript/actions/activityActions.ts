import { IActivity } from "../models/TypeBucket";

export const ADD_ACTIVITIES = "ADD_ACTIVITIES";
export const SET_ACTIVITY = "SET_ACTIVITY";
export const DELETE_WORKSHOP_EVENT = "DELETE_WORKSHOP_EVENT";

export interface ActivityAction {
  type: string;
  activities?: IActivity[];
  activity?: IActivity;
  activityId?: number;
  workshopId?: number;
}

export function addActivities(activities: IActivity[]): ActivityAction {
  return {
    type: ADD_ACTIVITIES,
    activities: activities
  };
}

export function setActivity(activity: IActivity): ActivityAction {
  return {
    type: SET_ACTIVITY,
    activity: activity
  };
}

export function deleteWorkshopEvent(
  activityId: number,
  workshopId: number
): ActivityAction {
  return {
    type: DELETE_WORKSHOP_EVENT,
    activityId,
    workshopId
  };
}
