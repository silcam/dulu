import Activity from "models/Activity";
import translator from "i18n/i18n";
import MockDate from "mockdate";

const t = translator("en");
const translationActivity = {
  id: 101,
  type: "TranslationActivity",
  bible_book_id: 1,
  stage_name: "Drafting",
  stage_date: "2018-10-10"
};
const researchActivity = {
  id: 202,
  type: "LinguisticActivity",
  category: "Research",
  title: "Ewondo Tone",
  stage_name: "Review",
  stage_date: "2018-11-11"
};
const workshopsActivity = {
  id: 303,
  type: "LinguisticActivity",
  category: "Workshops",
  title: "Ewondo Grammar",
  workshops: [
    {
      completed: true,
      name: "Noun"
    },
    {
      completed: false,
      name: "Verb",
      date: "2019-06"
    }
  ]
};
const mediaActivity = {
  id: 404,
  type: "MediaActivity",
  film: "LukeFilm",
  category: "Film",
  stage_name: "Script",
  stage_date: "2018-12-12"
};

beforeAll(() => {
  MockDate.set(new Date(2019, 1, 27));
});

afterAll(() => {
  MockDate.reset();
});

test("available books", () => {
  const availableBooks = Activity.availableBooks([translationActivity], t);
  expect(availableBooks.length).toBe(65);
  expect(availableBooks[0].name).toEqual("Exodus");
});

test("translation next stage", () => {
  const exp = {
    id: 0,
    name: "Testing",
    start_date: "2019-02-27",
    activity_id: 101
  };
  expect(Activity.nextStage(translationActivity)).toEqual(exp);
});

test("stage after last stage in undefined", () => {
  const publishedActivity = Object.assign({}, translationActivity);
  publishedActivity.stage_name = "Published";
  expect(Activity.nextStage(publishedActivity).name).toBeUndefined;
});

test("Some names", () => {
  expect(Activity.name(translationActivity, t)).toEqual("Genesis");
  expect(Activity.name(researchActivity, t)).toEqual("Ewondo Tone");
  expect(Activity.name(workshopsActivity, t)).toEqual("Ewondo Grammar");
  expect(Activity.name(mediaActivity, t)).toEqual("Luke Film");
});

test("some progress", () => {
  expect(Activity.progress(translationActivity).percent).toEqual(10);
  expect(Activity.progress(researchActivity).percent).toEqual(75);
  expect(Activity.progress(workshopsActivity).percent).toEqual(50);
  expect(Activity.progress(mediaActivity).percent).toEqual(40);
});

test("translation stages", () => {
  const stages = Activity.stages(translationActivity);
  expect(stages.length).toBe(11);
  expect(stages[1]).toEqual("Drafting");
});

test("research stages", () => {
  const stages = Activity.stages(researchActivity);
  expect(stages.length).toBe(5);
  expect(stages[1]).toEqual("Research");
});

test("media stages", () => {
  const stages = Activity.stages(mediaActivity);
  expect(stages.length).toBe(7);
  expect(stages[1]).toEqual("Application");
});

test("workshop stages", () => {
  const stages = Activity.stages(workshopsActivity);
  expect(stages.length).toBe(2);
  expect(stages[1]).toEqual("Verb");
});

test("some current stage names", () => {
  expect(Activity.currentStageName(translationActivity, t)).toEqual("Drafting");
  expect(Activity.currentStageName(researchActivity, t)).toEqual("Review");
  expect(Activity.currentStageName(workshopsActivity, t)).toEqual("Verb");
  expect(Activity.currentStageName(mediaActivity, t)).toEqual("Script");
});

test("is a workshops a workshops?", () => {
  expect(Activity.isWorkshops(workshopsActivity)).toBe(true);
  expect(Activity.isWorkshops(translationActivity)).toBe(false);
  expect(Activity.isWorkshops(researchActivity)).toBe(false);
});

test("some stage dates", () => {
  expect(Activity.stageDate(translationActivity)).toEqual("2018-10-10");
  expect(Activity.stageDate(researchActivity)).toEqual("2018-11-11");
  expect(Activity.stageDate(mediaActivity)).toEqual("2018-12-12");
  expect(Activity.stageDate(workshopsActivity)).toEqual("2019-06");
});

test("Compare: diff domains", () => {
  expect(Activity.compare(translationActivity, mediaActivity)).toBeGreaterThan(
    0
  );
});

test("Compare: research & workshops", () => {
  expect(Activity.compare(researchActivity, workshopsActivity)).toBeLessThan(0);
});

test("Compare: translation activities", () => {
  expect(
    Activity.compare(translationActivity, {
      type: "TranslationActivity",
      bible_book_id: 2
    })
  ).toBeLessThan(0);
});

test("Compare: compare by name", () => {
  expect(
    Activity.compare(mediaActivity, {
      type: "MediaActivity",
      category: "Film",
      film: "MagdalenaFilm"
    })
  ).toBeLessThan(0);
  expect(
    Activity.compare(researchActivity, {
      type: "LinguisticActivity",
      category: "Research",
      title: "AAA"
    })
  ).toBeGreaterThan(0);
});
