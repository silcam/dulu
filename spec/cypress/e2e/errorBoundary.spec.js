// MainRouter's error boundary, which nothing else in the suite reaches.
//
// The app ships a route -- /events/crash-me-now -- whose only purpose is to
// throw during render, and BaseMainRouter.componentDidCatch posts a report to
// /api/errors so an admin gets an email. This spec was written during the
// React 18 upgrade (Phase 7a) because getDerivedStateFromError and
// componentDidCatch are the only class lifecycle methods left in the codebase,
// they are the kind of thing a React major changes, and nothing covered them.
//
// It was written SKIPPED because it failed -- on the behaviour, not on the
// assertions. The boundary did not show its error page: visiting the crash
// route left a blank page (#app empty), threw React error #185 "Maximum update
// depth exceeded", and posted a flood of reports to /api/errors instead of
// one, which in production is an admin email per post.
//
// Verified at the time NOT to be a React 18 regression: reverting
// react/react-dom to 16.8.6 and rebuilding reproduced it identically. The
// cause was BaseMainRouter.componentDidUpdate clearing `hasError` on any
// update, which re-rendered the route that had just crashed, so it threw
// again. Fixed in Phase 8d item 1 by clearing on a location change instead,
// and unskipped here.
describe("Error boundary", () => {
  before(cy.appFixtures);

  it("Catches a render crash, reports it, and recovers", () => {
    cy.login();
    cy.intercept("POST", "/api/errors").as("errorReport");

    cy.visit("/events/crash-me-now");

    cy.contains("h2", "Oh, bother!");

    // The report carries the location. Under React Router 5 it carried the
    // history object, which serialised to almost nothing useful.
    cy.wait("@errorReport")
      .its("request.body.content")
      .then(content => {
        expect(content.error).to.contain("notAFunction");
        expect(content.location.pathname).to.eq("/events/crash-me-now");
      });

    // Exactly one, now that the loop is fixed and the real number is
    // observable -- this assertion was `at.most(2)` while it was not. The note
    // it replaces expected 1 or 2, on the grounds that React 18 can invoke
    // componentDidCatch twice for a boundary-caught error; measured here, and
    // stable across runs, it posts once. This is the assertion that would have
    // caught the original defect on its own: the flood was thousands.
    cy.get("@errorReport.all").should("have.length", 1);

    // And the user has to be able to leave.
    cy.contains("button", "Reload").should("exist");
    cy.visit("/regions/944766880");
    cy.contains("h2", "North Region");
  });
});
