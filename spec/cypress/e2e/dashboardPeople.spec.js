// The dashboard's People tab loads participants for whichever languages the sidebar
// selection covers. DBParticipantsTable's effect used to pass `props.languageIds`
// *as* its dependency array rather than as a dependency, and React compares
// dependency arrays pairwise only up to min(prev.length, next.length) -- so when a
// selection was a superset of the previous one with the same leading ids, every
// comparison passed and the effect was skipped entirely.
//
// The visible symptom: pick North Region, then Cameroon, and Cameroon -- the largest
// selection there is -- fetched nothing, leaving the tab showing whatever earlier
// clicking had left in the store.
//
// Asserting on the requests rather than the rendered rows, because the store
// accumulates: people loaded by an earlier selection stay in it, so the table can
// look plausible while the fetch it needed never happened.

describe("Dashboard People tab", () => {
  before(cy.appFixtures);

  it("loads participants when the selection grows to a superset", () => {
    const requested = [];
    cy.intercept("GET", "/api/languages/*/participants", req => {
      requested.push(req.url.replace(/^.*\/api\/languages\//, "").replace("/participants", ""));
      req.continue();
    });

    cy.login();
    cy.visit("/");
    cy.contains("tr", "Bangolan");

    // A language selection renders DashboardLanguagePage, not MainContent, so the
    // People tab only exists for the country/region/cluster/user selections.
    cy.contains("li", "Drew Mambo").find("button.link").click();
    cy.contains("[role=tab]", "People").click();
    cy.contains("li", "North Region").find("button.link").click();

    cy.then(() => {
      requested.length = 0;
    });

    cy.contains("li", "Cameroon").find("button.link").click();

    // Cameroon covers every language, so it must fetch at least as many as North
    // Region did -- and more than zero, which is what the bug produced.
    cy.wrap(null).should(() => {
      expect(requested.length, "participant fetches after selecting Cameroon").to.be.greaterThan(2);
    });
  });
});
