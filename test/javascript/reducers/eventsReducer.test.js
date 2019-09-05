import eventsReducer from "reducers/eventsReducer";
import {
  addEvents,
  addEventsForLanguage
} from "../../../app/javascript/actions/eventActions";
import { emptyEvent } from "../../../app/javascript/models/Event";
import List from "../../../app/javascript/models/List";

const makeEvent = obj => Object.assign(emptyEvent(), obj);

const newYears = makeEvent({
  id: 101,
  start_date: "2019-01-01",
  end_date: "2019-01-01",
  language_ids: [888]
});
const jan = makeEvent({
  id: 202,
  start_date: "2019-01",
  end_date: "2019-01",
  language_ids: [888]
});
const school = makeEvent({
  id: 404,
  start_date: "2019-01-07",
  end_date: "2019-06-01",
  language_ids: [888]
});
const dec = makeEvent({
  id: 303,
  start_date: "2018-12",
  end_date: "2018-12",
  language_ids: [888]
});
const valentines = makeEvent({
  id: 505,
  start_date: "2019-02-14",
  end_date: "2019-02-14",
  language_ids: []
});
const twentyTwenty = makeEvent({
  id: 606,
  start_date: "2020",
  end_date: "2020",
  language_ids: [888]
});

test("addEventsByMonth", () => {
  const initialState = {
    list: new List(emptyEvent(), [newYears, jan, dec]),
    backTo: {}
  };

  checkList(
    eventsReducer(
      initialState,
      addEvents([newYears, school], {
        start: { year: 2019, month: 1 },
        end: { year: 2019, month: 1 }
      })
    ).list,
    [101, 303, 404]
  );
});

test("addEventsForLanguageByYear", () => {
  const initialState = {
    list: new List(emptyEvent(), [newYears, jan, dec, valentines]),
    backTo: {}
  };
  checkList(
    eventsReducer(
      initialState,
      addEventsForLanguage([newYears, school], 888, {
        start: { year: 2019 },
        end: { year: 2019 }
      })
    ).list,
    [101, 303, 404, 505]
  );
});

test("addEventsForLanguageFromYear", () => {
  const initialState = {
    list: new List(emptyEvent(), [
      newYears,
      jan,
      dec,
      valentines,
      twentyTwenty
    ]),
    backTo: {}
  };
  checkList(
    eventsReducer(
      initialState,
      addEventsForLanguage([newYears, school], 888, { start: { year: 2019 } })
    ).list,
    [101, 303, 404, 505]
  );
});

// list: List<IEvent>, ids: number[]
function checkList(list, ids) {
  const toObj = ids => ids.reduce((obj, id) => ({ ...obj, [id]: id }), {});
  expect(toObj(list.map(item => item.id))).toEqual(toObj(ids));
}
