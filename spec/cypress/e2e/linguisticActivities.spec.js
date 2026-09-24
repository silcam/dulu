const bangolanPath = "/languages/248732538";
const ewondoPath = "/languages/406181303";

describe("Linguistic Activities", () => {
  before(cy.appFixtures);

  it("Creates Research Activity", () => {
    cy.login();
    cy.visit(bangolanPath + "/Linguistics");
    cy.contains("Research Activities").within(() => {
      cy.icon("addIcon").click();
    });
    cy.placeholder("Title").type("Bangolan Pig Latin");
    cy.contains("Save").click();
    cy.contains("tr", "Bangolan Pig Latin").should("contain", "Planned");
  });

  it("Creates Workshops Activity", () => {
    cy.login();
    cy.visit(bangolanPath + "/Linguistics");
    cy.contains("div", "Workshops Activities").within(() => {
      cy.icon("addIcon").click();
      cy.placeholder("Title").type("Bangolan Grammarz");
      cy.placeholder("Name").type("Nounz");
      cy.icon("addIcon").click();
      cy.contains("tr", "2").find("input").type("Verbz");
      cy.contains("Save").click();
    });
    cy.contains("tr", "Bangolan Grammarz").should("contain", "Nounz");
    cy.contains("Bangolan Grammarz").click();
    cy.contains("tr", "Nounz");
    cy.contains("tr", "Verbz");
  });

  it("Updates WS Activity", () => {
    cy.login("kendall_ingles@sil.org");
    cy.visit(ewondoPath + "/Linguistics");
    cy.contains("Grammar Intro").click();

    // Complete with Event,  Edit name & Delete
    // The row is captured with .then/.wrap rather than chained off
    // cy.contains("tr", "Verb") for the whole block. Cypress 12 re-runs the
    // entire query chain on every retry, and opening the edit form moves the
    // row's visible text into an <input value="Verb"> -- cy.contains matches
    // text, not input values, so the re-query stops matching and the block
    // fails with "Expected to find element: input[type='text']" even though the
    // input is plainly on the page. cy.wrap holds a concrete element, so it is
    // not re-queried.
    cy.contains("tr", "Verb").then($row => {
      cy.wrap($row).within(() => {
        cy.contains("button", "Completed").click();
        cy.contains("button", "Completed").should("not.exist");
        cy.icon("editIcon").click();
        cy.get("input[type='text']").type("s & stuff");
        // cy.contains("Completed").click();
        cy.contains("Save").click();
        cy.contains("Verbs & stuff");
        // cy.contains("button", "Completed");
        cy.icon("deleteIcon").click();
      });
    });
    cy.contains("tr", "Verb").should("not.exist");

    // Complete without event, uncomplete & add event. Wrapped for the same
    // reason as the Verb block above -- each click here mutates the row.
    cy.contains("tr", "Syntax").then($row => {
      cy.wrap($row).within(() => {
      cy.contains("button", "Completed").click();
      cy.fillFuzzyDate(2019, "Mar", 19);
      cy.contains("Save").click();
      cy.contains("2019-03-19");
      cy.contains("Completed");
      cy.contains("button", "Completed").should("not.exist");
      cy.icon("editIcon").click();
      cy.contains("Completed").click();
      cy.contains("Save").click();
      cy.contains("button", "Completed");
      cy.contains("2019-03-19").should("not.exist");
      cy.contains("Add Event").click();
      });
    });
    cy.contains("div", "Start Date").within(() =>
      cy.fillFuzzyDate(2020, "Jan", 1)
    );
    cy.contains("div", "End Date").within(() =>
      cy.fillFuzzyDate(2020, "Jan", 7)
    );
    cy.contains("Save").click();
    cy.contains("a", "2020-01-07");

    // Add Workshop
    cy.icon("addIcon").click();
    cy.placeholder("Workshop Name").type("Discourse");
    cy.contains("Save").click();
    cy.contains("Save").should("not.exist");
    cy.contains("tr", "Discourse").within(() => {
      cy.contains("a", "Add Event");
      cy.contains("button", "Completed");
    });
  });
});
