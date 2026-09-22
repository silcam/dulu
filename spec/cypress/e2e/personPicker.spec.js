const northRegionPath = "/regions/944766880";
const hdiPath = "/languages/876048951";

describe("People Picker", () => {
  beforeEach(cy.appFixtures);

  it("Adds new person in picker", () => {
    cy.login("olga_ngombo@sil.org");
    cy.visit(northRegionPath);
    cy.icon("editIcon").click();
    cy.contains("label", "LPF").within(() => {
      cy.get("input")
        .clear()
        .type("charlie mcguffin");
      cy.contains("Add Person").click();
      cy.contains("New Person");
      cy.contains("Save").click();
      cy.contains("New Person").should("not.exist");
    });

    cy.contains("Save").click();
    cy.contains("LPF: Charlie Mcguffin");
  });

  // The regression test for 8d item 3. The bug: Enter with no arrow-key selection
  // takes the top row, and until the current query's response lands the picker shows
  // the longest cached prefix instead. A prefix of a multi-word query matches *more*
  // than the query does, because the server ORs the words -- "Drew M" returns
  // everyone with an "m" in their name, ordered by last name, so the top row is Lance
  // Armstrong. Typing a full name and hitting Enter saved the wrong person.
  //
  // The delay is what makes it deterministic. Without it the exact response usually
  // wins the race and the picker behaves; the bug was real but probabilistic, which
  // is why it moved between specs instead of failing the same one every run.
  it("Does not select a prefix match when Enter beats the response", () => {
    cy.intercept("GET", "/api/people/search*", req => {
      // Alias the one request this test turns on, so the wait below is for that
      // response and not for a fixed number of milliseconds.
      if (req.query.q == "Drew Mambo") req.alias = "exactSearch";
      req.reply(res => res.setDelay(400));
    });
    cy.login();
    cy.visit(hdiPath + "/People");
    cy.contains("h3", "People").within(() => {
      cy.icon("addIcon").click();
    });

    // Let the prefix results land and confirm the trap is actually set: Lance
    // Armstrong is the first row of the results for "Drew M".
    cy.placeholder("Name").type("Drew M");
    cy.placeholder("Name")
      .parent()
      .within(() => {
        cy.get("li").first().should("have.text", "Lance Armstrong");
      });

    // Finish the name and commit before the response for it can arrive. That Enter
    // has to be a no-op.
    cy.placeholder("Name").type("ambo{Enter}");

    // Assert *after* the in-flight response lands, not in the same tick. Checking
    // immediately proves nothing: the value is still the typed text until React
    // re-renders, so an assertion made right after the keystroke passes whether or
    // not the wrong person was selected. This test passed against the unfixed code
    // until the wait was moved above the assertion.
    //
    // Waiting on the request rather than on the dropdown for the same reason: the
    // list narrows to Drew Mambo alone at "Drew Mamb", one keystroke early, so a
    // list that looks right does not mean the current query has been answered.
    cy.wait("@exactSearch");
    cy.placeholder("Name").should("have.value", "Drew Mambo");
  });

  // Deliberately not asserting that a later Enter then selects Drew Mambo. The
  // response arriving is not the same moment as React rendering it, so a keystroke
  // sent straight after cy.wait() sometimes still sees the prefix results and is
  // correctly ignored -- the assertion failed in 3 of 4 runs while the fix was in
  // place. That path is covered where it is stable, by participants.spec.js and
  // clusters.spec.js, which wait for the dropdown before pressing Enter.

  it("Handles duplicates", () => {
    cy.login();
    cy.visit(hdiPath + "/People");
    cy.contains("h3", "People").within(() => {
      cy.icon("addIcon").click();
    });
    cy.placeholder("Name").type("abanda dunno");
    cy.contains("Add Person").click();
    cy.contains("New Person");
    cy.contains("Save").click();
    cy.contains("Abanda Dunno may already exist");
    cy.contains("button", "Save").should("be.disabled");
    cy.contains("This is a different person").click();
    cy.contains("button", "Save").click();
    cy.contains("New Person").should("not.exist");
    cy.placeholder("Name").should("have.value", "Abanda Dunno");
  });
});
