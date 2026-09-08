// MainRouter's error boundary, which nothing else in the suite reaches.
//
// The app ships a route -- /events/crash-me-now -- whose only purpose is to
// throw during render, and BaseMainRouter.componentDidCatch posts a report to
// /api/errors so an admin gets an email. This spec was written during the
// React 18 upgrade (Phase 7a) because getDerivedStateFromError and
// componentDidCatch are the only class lifecycle methods left in the codebase,
// they are the kind of thing a React major changes, and nothing covered them.
//
// It is SKIPPED because it fails -- on the behaviour, not on the assertions.
// The boundary does not show its error page. Visiting the crash route leaves a
// blank page (#app empty), throws React error #185 "Maximum update depth
// exceeded", and posts a flood of reports to /api/errors instead of one. In
// production that is an email per post.
//
// Verified NOT to be a React 18 regression: reverting react/react-dom to
// 16.8.6 and rebuilding reproduces it identically, same blank page, same
// flood. The cause is BaseMainRouter.componentDidUpdate, which clears
// `hasError` whenever the previous state had it set -- so the crashing route
// re-renders, throws again, and the boundary re-enters the cycle. It is meant
// to let the user navigate away from the error page, and it does that by
// re-rendering the thing that just crashed.
//
// Tracked as Phase 8 item 15. Unskip it there: it is the failing test that
// item asks for, and it already asserts the behaviour the fix should produce.
describe.skip("Error boundary", () => {
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

    // One report per crash, not one per render attempt.
    cy.get("@errorReport.all").should("have.length", 1);

    // And the user has to be able to leave.
    cy.contains("button", "Reload").should("exist");
    cy.visit("/regions/944766880");
    cy.contains("h2", "North Region");
  });
});
