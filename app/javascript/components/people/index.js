import "babel-polyfill";

import React from "react";
import ReactDOM from "react-dom";

import PeopleBoard from "./components/PeopleBoard";

const reactDiv = document.querySelector("#react");
const authToken = reactDiv.getAttribute("data-authenticity-token");
const tab = reactDiv.getAttribute("data-tab");
const personId = reactDiv.getAttribute("data-person-id");
const orgId = reactDiv.getAttribute("data-organization-id");
const strings = JSON.parse(document.getElementById("strings").innerHTML);

ReactDOM.render(
  <PeopleBoard
    authToken={authToken}
    strings={strings}
    tab={tab}
    personId={personId}
    orgId={orgId}
  />,
  reactDiv
);
