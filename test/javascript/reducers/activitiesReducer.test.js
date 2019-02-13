import activitiesReducer from "reducers/activitiesReducer";
import { deleteWorkshopEvent } from "../../../app/javascript/actions/activityActions";

test("deleteWorkshopEvent", () => {
  const initialState = {
    101: { id: 101 },
    202: {
      id: 202,
      workshops: [{ id: 303 }, { id: 404, event_id: 888 }, { id: 505 }]
    }
  };
  const newState = activitiesReducer(
    initialState,
    deleteWorkshopEvent(202, 404)
  );
  expect(newState[202].workshops[1].event_id).toBeUndefined();
});
