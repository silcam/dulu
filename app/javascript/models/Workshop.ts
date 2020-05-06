export interface IWorkshop {
  id: number;
  name: string;
  completed: boolean;
  date?: string;
  activityId: number;
  event_id: number | null;
}
