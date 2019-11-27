import {
  parseChannels,
  channelsString
} from "../../../app/javascript/models/NotificationChannel";
import Language from "../../../app/javascript/models/Language";
import Cluster from "../../../app/javascript/models/Cluster";
import Region from "../../../app/javascript/models/Region";

const testLangs = Language.emptyList().add([
  { id: 1, name: "L One" },
  { id: 2, name: "L Two" }
]);
const testClusters = Cluster.emptyList().add([
  { id: 1, name: "C One" },
  { id: 2, name: "C Two" }
]);
const testRegions = Region.emptyList().add([
  { id: 1, name: "R One" },
  { id: 2, name: "R Two" }
]);

test("Parse Channels", () => {
  const channels = parseChannels("Lng2 Lng1 Cls2 Reg1 DTra ", {
    languages: testLangs,
    clusters: testClusters,
    regions: testRegions
  });
  expect(channels.languages).toEqual([testLangs.get(2), testLangs.get(1)]);
});

test("channelsString", () => {
  expect(
    channelsString({
      languages: testLangs.toArray(),
      clusters: testClusters.toArray(),
      regions: testRegions.toArray(),
      domains: ["Translation", "Linguistics", "Literacy", "Scripture_use"]
    })
  ).toEqual("Lng1 Lng2 Cls1 Cls2 Reg1 Reg2 DTra DLin DLit DScr ");
});
