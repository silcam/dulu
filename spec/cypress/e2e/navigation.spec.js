// Browser history semantics, which nothing else in the suite touches.
//
// Every other spec navigates forward only -- by cy.visit, or by clicking
// through -- so a push that should have been a replace (or a component that
// stops re-rendering when only the location changes) is invisible to them.
// React Router 6 replaces useHistory/withRouter with useNavigate at 18 call
// sites, and those are exactly the failures it can introduce.
//
// The three navigation mechanisms in the app are covered once each: a <Link>,
// an onClick that calls history.push directly, and a nested <Route>'s own
// history.push.
const hdiPath = "/languages/876048951";
const hdiEzraPath = "/languages/876048951/activities/1071624995";
const northRegionPath = "/regions/944766880";

describe("Navigation", () => {
  before(cy.appFixtures);

  it("Goes back from a row click", () => {
    // RegionsTable pushes from an onClick handler -- there is no <a> here, so
    // the browser's own history is doing none of the work.
    cy.login();
    cy.visit("/regions");
    cy.contains("tr", "North Region").click();
    cy.location("pathname").should("eq", northRegionPath);
    cy.contains("h2", "North Region");

    cy.go("back");
    cy.location("pathname").should("eq", "/regions");
    cy.contains("tr", "South Region");
  });

  it("Goes back from a link click", () => {
    // The ordinary <Link> case: ActivityRow's link into an activity page.
    cy.visit(hdiPath + "/Translation");
    cy.contains("a", "Ezra").click();
    cy.location("pathname").should("eq", hdiEzraPath);
    cy.contains("h2", "Ezra");

    cy.go("back");
    cy.location("pathname").should("eq", hdiPath + "/Translation");
    cy.contains("a", "Ezra");
  });

  it("Goes back through language tabs", () => {
    // LanguagePage pushes a tab change from inside a nested <Route>, so each
    // tab is its own history entry. Deep-linking to these URLs is well covered
    // elsewhere; arriving by click and then reversing is not.
    cy.visit(hdiPath);
    cy.contains("Translation").click();
    cy.location("pathname").should("eq", hdiPath + "/Translation");
    cy.contains("Literacy").click();
    cy.location("pathname").should("eq", hdiPath + "/Literacy");

    cy.go("back");
    cy.location("pathname").should("eq", hdiPath + "/Translation");

    // A reload has to land on the same tab: the URL, not component state, is
    // what selects it.
    cy.reload();
    cy.location("pathname").should("eq", hdiPath + "/Translation");
    cy.contains("h2", "Hdi");
  });
});
