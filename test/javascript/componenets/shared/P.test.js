import React from "react";
// import ReactDOM from "react-dom";
import { shallow } from "enzyme";
import P from "components/shared/P";

test("rendered componenet", () => {
  const wrapper = shallow(
    <P>
      <div>Here are some words.</div>
    </P>
  );
  expect(wrapper).toMatchSnapshot();
});
