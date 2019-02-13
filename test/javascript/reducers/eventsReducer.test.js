import eventsReducer from "reducers/eventsReducer";
import {
  addEvents,
  addEventsForLanguage
} from "../../../app/javascript/actions/eventActions";

const newYears = {
  id: 101,
  start_date: "2019-01-01",
  end_date: "2019-01-01",
  language_ids: [888]
};
const jan = {
  id: 202,
  start_date: "2019-01",
  end_date: "2019-01",
  language_ids: [888]
};
const school = {
  id: 404,
  start_date: "2019-01-07",
  end_date: "2019-06-01",
  language_ids: [888]
};
const dec = {
  id: 303,
  start_date: "2018-12",
  end_date: "2018-12",
  language_ids: [888]
};
const valentines = {
  id: 505,
  start_date: "2019-02-14",
  end_date: "2019-02-14",
  language_ids: []
};
const twentyTwenty = {
  id: 606,
  start_date: "2020",
  end_date: "2020",
  language_ids: [888]
};

test("addEventsByMonth", () => {
  const initialState = {
    byId: { 101: newYears, 202: jan, 303: dec },
    backTo: {}
  };
  expect(
    eventsReducer(
      initialState,
      addEvents([newYears, school], {
        start: { year: 2019, month: 1 },
        end: { year: 2019, month: 1 }
      })
    ).byId
  ).toEqual({
    101: newYears,
    303: dec,
    404: school
  });
});

test("addEventsForLanguageByYear", () => {
  const initialState = {
    byId: { 101: newYears, 202: jan, 303: dec, 505: valentines },
    backTo: {}
  };
  expect(
    eventsReducer(
      initialState,
      addEventsForLanguage(
        [newYears, school],
        { id: 888 },
        { start: { year: 2019 }, end: { year: 2019 } }
      )
    ).byId
  ).toEqual({
    101: newYears,
    303: dec,
    404: school,
    505: valentines
  });
});

test("addEventsForLanguageFromYear", () => {
  const initialState = {
    byId: {
      101: newYears,
      202: jan,
      303: dec,
      505: valentines,
      606: twentyTwenty
    },
    backTo: {}
  };
  expect(
    eventsReducer(
      initialState,
      addEventsForLanguage(
        [newYears, school],
        { id: 888 },
        { start: { year: 2019 } }
      )
    ).byId
  ).toEqual({
    101: newYears,
    303: dec,
    404: school,
    505: valentines
  });
});
