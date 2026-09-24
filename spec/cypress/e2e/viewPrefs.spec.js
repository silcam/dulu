// Api::PeopleController#update_view_prefs used to carry
// `skip_before_action :verify_authenticity_token` (UPGRADE_PLAN 8a.8). With that
// gone, the browser flow depends on DuluAxios supplying the CSRF token, and until
// now nothing exercised view prefs end to end at all.
//
// This spec covers the REGRESSION property -- view prefs still round-trip through a
// real browser -- and deliberately not the security property.
//
// It cannot cover the security property, and that is worth stating so nobody later
// reads it as CSRF coverage. config/environments/test.rb disables
// allow_forgery_protection, so `csrf_meta_tags` renders nothing (verified), which
// means getAuthToken() falls into its catch and sends the string "None". A wholly
// tokenless request would succeed here too. Enforcement is asserted in
// test/controllers/people_controller_test.rb via `with_forgery_protection`; the real
// token can only be checked in a browser against a non-test environment, which is
// what GO_LIVE_QA_PLAN.md's Tier 0 sign-in check is for.
//
// Filename sorts last on purpose: testIsolation is false, so state a spec leaves
// behind is visible to the specs that follow it, and this one writes to Drew's
// view_prefs and leaves the dashboard on a language rather than the default view.

describe("View Prefs", () => {
  before(cy.appFixtures);

  it("Persists the dashboard selection across a reload", () => {
    cy.intercept("PUT", "/api/people/update_view_prefs").as("saveViewPrefs");

    cy.login();
    cy.visit("/");
    // Wait for the dashboard's own data before touching the sidebar -- the
    // languages arrive from CoreData after first paint.
    cy.contains("tr", "Bangolan");

    // The click target is the <button class="link"> inside the li, not the li --
    // DashboardSidebarItem renders the label as a button and the li fills the
    // sidebar width, so clicking the li's centre lands to the right of a short
    // label like "Hdi" and does nothing at all. dashboard.spec.js gets away with
    // `cy.contains("li", ...).click()` only because its labels are long enough to
    // reach the centre.
    cy.contains("li", "Hdi").find("button.link").click();
    // A selected language renders DashboardLanguagePage -> LanguagePage, whose
    // heading is an h2. (MainContent's own heading, for a non-language selection,
    // is an h3 -- so this assertion also proves a *language* was selected.)
    cy.contains("h2", "Hdi");

    cy.wait("@saveViewPrefs").then(({ request, response }) => {
      // 204 from response_ok. A 422 here would mean the CSRF token was rejected,
      // and a 413 would mean MAX_VIEW_PREFS_BYTES is set too low for real payloads.
      expect(response.statusCode).to.eq(204);
      // The token plumbing runs at all: DuluAxios.put always attaches this. Its
      // value is "None" in the test environment, so there is nothing to assert
      // about the value itself.
      expect(request.body).to.have.property("authenticity_token");
    });

    // The reload is the whole point. The selection is only restored if the PUT
    // actually persisted -- Dashboard reads it back from currentUser.view_prefs,
    // which WebController embeds in the page.
    cy.reload();
    cy.contains("h2", "Hdi");
  });
});
