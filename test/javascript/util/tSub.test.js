import { postponeFailure } from "../testUtil";

test("tSub", () => {
  // This needs to be deprecated!
  postponeFailure(new Date(2019, 2, 15));
});
