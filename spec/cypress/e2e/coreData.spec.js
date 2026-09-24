// CoreData refreshes the shared collections on navigation, at most once every five
// minutes. That is a deliberate choice, and this spec exists because nothing about
// the code makes it self-evident -- the two obvious "improvements" are both worse,
// and both are one small edit away:
//
//   - a setInterval polls from every open tab forever, including tabs nobody is
//     looking at, to keep a cache warm that only GoBar reads;
//   - loading once on mount leaves an active user on a page-load snapshot.
//
// Gating on navigation spends requests only while someone is using the app. If a
// future change makes this spec fail, the question to ask is whether that trade was
// reconsidered on purpose -- not how to make the assertion pass.
//
// /api/organizations is the collection under test because no board visited here
// fetches it. /api/languages and /api/people are also loaded by LanguagesBoard and
// PeopleBoard on mount, so their counts would mix CoreData's requests with the
// boards'. See UPGRADE_PLAN 8c item 4.

describe("Core Data", () => {
  before(cy.appFixtures);

  it("refreshes on navigation, throttled to five minutes", () => {
    let hits = 0;
    cy.intercept("GET", "/api/organizations", req => {
      hits++;
      req.continue();
    });

    cy.login();

    // Fake Date only. Faking timers too would stop React's scheduler and axios from
    // running, and this needs real async with a controllable clock.
    cy.clock(Date.now(), ["Date"]);

    cy.visit("/");
    cy.contains("tr", "Bangolan");
    cy.then(() => expect(hits, "on page load").to.eq(1));

    cy.contains("a", "Languages").click();
    cy.contains("tr", "Hdi");
    cy.contains("a", "People").click();
    cy.contains("a", "Events").click();
    cy.then(() => expect(hits, "three navigations inside the window").to.eq(1));

    cy.tick(5 * 60 * 1000 + 1000);
    cy.contains("a", "Languages").click();
    cy.contains("tr", "Hdi");
    cy.then(() => expect(hits, "first navigation past the window").to.eq(2));

    cy.contains("a", "People").click();
    cy.then(() => expect(hits, "throttled again immediately after").to.eq(2));

    // testIsolation is false in this suite, so hand the real clock back rather than
    // leaving a frozen Date for whatever spec runs next.
    cy.clock().then(clock => clock.restore());
  });
});
