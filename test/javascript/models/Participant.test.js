import Participant from "models/Participant";

const myLang = {
  translation_activities: [
    {
      id: 101,
      name: "Genesis",
      participant_ids: []
    },
    {
      id: 102,
      name: "Exodus",
      participant_ids: [202]
    }
  ],
  research_activities: [],
  workshops_activities: [],
  media_activities: [],
  participants: [
    {
      id: 202,
      name: "Joe",
      activity_ids: [102, 707] // 707 would be an activity in another language
    },
    { id: 203, name: "Frank", activity_ids: [] }
  ]
};

test("participantsForActivity", () => {
  expect(
    Participant.participantsForActivity(
      myLang,
      myLang.translation_activities[1]
    )
  ).toEqual([myLang.participants[0]]);
});

test("activitiesForParticipant", () => {
  expect(
    Participant.activitiesForParticipant(myLang, myLang.participants[0])
  ).toEqual([myLang.translation_activities[1]]);
});
