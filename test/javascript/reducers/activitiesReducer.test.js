import activitiesReducer from "reducers/activitiesReducer";
import { deleteWorkshopEvent } from "../../../app/javascript/actions/activityActions";
import List from "../../../app/javascript/models/List";

test("deleteWorkshopEvent", () => {
  const initialState = new List({ id: 0 }, [
    { id: 101 },
    {
      id: 202,
      workshops: [{ id: 303 }, { id: 404, event_id: 888 }, { id: 505 }]
    }
  ]);

  const newState = activitiesReducer(
    initialState,
    deleteWorkshopEvent(202, 404)
  );
  expect(newState.get(202).workshops[1].event_id).toBeUndefined();
});
