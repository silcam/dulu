import Cluster from "models/Cluster";

const ndop = {
  id: 101,
  name: "Ndop",
  languages: [
    {
      id: 202,
      name: "Bambalang"
    },
    {
      id: 303,
      name: "Bamessing"
    }
  ]
};

test("comparison", () => {
  expect(
    Cluster.compare(ndop, { name: "Central Chadic East" })
  ).toBeGreaterThan(0);
});

test("clusterParams", () => {
  expect(Cluster.clusterParams(ndop)).toEqual({
    name: "Ndop",
    language_ids: [202, 303]
  });
});
