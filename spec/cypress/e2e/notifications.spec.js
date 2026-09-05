// The feed, and the wildcard activity route the feed's links depend on.
//
// Nothing else in the suite visits /feed, and nothing else exercises
// MainRouter's `/*activities/:id` route. That route is not decoration: every
// activity link in a notification is built server-side by
// ApplicationHelper#model_path (app/models/notification.rb#linkify), which
// yields the *subclass* path -- "/translation_activities/1071624995",
// "/linguistic_activities/...", "/media_activities/..." -- and the leading
// wildcard is what absorbs the varying prefix. ActivityPage then looks the
// activity up and history.replace()s to the canonical language-scoped URL.
//
// React Router 6 cannot express that pattern (splats must be trailing), so
// this spec is the acceptance test for whatever replaces it.
const hdiEzraPath = "/languages/876048951/activities/1071624995";

describe("Notifications", () => {
  before(() => {
    cy.appFixtures();
    // The fixtures ship no notifications, and the feed is read-only -- there is
    // no in-app way to make one except by performing an unrelated action.
    cy.appEval(
      `Notification.new_activity(
         Person.find_by(email: "drew_mambo@sil.org"),
         Activity.find(1071624995)
       )`
    );
  });

  it("Shows the feed and follows an activity link", () => {
    cy.login();
    cy.visit("/feed");

    // Structural, not just textual: NotificationsPage renders the list inside
    // MasterDetail's `detail` pane, and a Routes conversion that mounts the
    // page at the wrong point in the tree can still produce the right words in
    // the wrong layout. Same localIdentName pattern cssModules.spec.js checks.
    cy.get("div[class^='MasterDetail__detail___']").within(() => {
      cy.contains("added a new activity").should("exist");
    });

    // The subclass path, redirected to the canonical one by ActivityPage.
    cy.contains("a", "Ezra").click();
    cy.url().should("include", hdiEzraPath);
    cy.contains("h2", "Ezra");

    // ActivityPage replaces rather than pushes, so the intermediate
    // /translation_activities/:id URL must not be a back-button stop --
    // otherwise going back bounces the user straight forward again.
    cy.go("back");
    cy.url().should("include", "/feed");
    cy.contains("added a new activity").should("exist");
  });
});
