import { toggleStateFlag } from "util/toggleStateFlag";
import { postponeFailure } from "../testUtil";

let toggle = false;
let component = {
  setState: cb => {
    const newState = cb({ toggle: toggle });
    toggle = newState.toggle;
  }
};

test("toggle state flag", () => {
  expect(toggle).toBe(false);
  toggleStateFlag(component, "toggle");
  expect(toggle).toBe(true);
  toggleStateFlag(component, "toggle");
  expect(toggle).toBe(false);
});
