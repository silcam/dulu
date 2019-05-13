export interface IWorkshop {
  id: number;
  name: string;
  completed: boolean;
  date?: string;
  number: number;
  activityId: number;
  event_id: number | null;
  formattedDate: string | null;
}
