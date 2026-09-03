describe("Reports", () => {
  beforeEach(cy.appFixtures);

  it("Translation Progress Reports", () => {
    cy.login();
    cy.visit("/reports");
    cy.contains("Translation Progress").click();
    cy.placeholder("Add Cluster").type("Ndop");
    cy.contains("li", "Ndop").click();
    cy.contains("h3", "Ndop");
    cy.contains("h4", "Bambalang");
    cy.placeholder("Add Language").type("Hdi");
    cy.contains("li", "Hdi").click();
    cy.contains("h4", "Hdi")
      .parent()
      .within(() => {
        cy.contains("Gen").should(
          "have.css",
          "background-color",
          "rgb(93, 173, 226)"
        );
      });

    cy.contains("Save").click();
    cy.placeholder("Report Name").type("Ndop-Hdi");
    cy.contains("button", "Save").click();
    cy.contains("h2", "Ndop-Hdi");
    cy.contains("Created by Drew Mambo");
  });

  it("Domain Reports", () => {
    cy.login();
    cy.visit("/reports");
    cy.contains("Domain").click();
    cy.inLabel("Domain").select("Translation");
    cy.contains("div", "Start").within(() => {
      cy.contains("select", "2017").select("2017");
    });
    cy.contains("div", "End").within(() => {
      cy.contains("select", "2017").select("2017");
    });

    // Both rows carry start_date 2017-05-29 and DomainReport#gen_activity_items orders
    // only by `start_date: :desc` with no tiebreaker, so PostgreSQL is free to return
    // them either way round. Asserting fixed row positions made this spec fail roughly
    // at random. Assert that both rows are present instead, and leave their order to the
    // application to fix -- see UPGRADE_PLAN.md Phase 8.
    cy.contains("table", "Language").within(() => {
      cy.contains("tr", "HdiGenesisConsultant Check in Progress2017-05-29");
      cy.contains("tr", "ZulgoEzraConsultant Check in Progress2017-05-29");
    });
    cy.contains("table", "Name")
      .find("tr:nth-child(3)")
      .should("have.text", "Check a book now2017-072017-07Hdi");

    cy.placeholder("Add Language").type("Zulgo");
    cy.contains("li", "Zulgo").click();
    cy.contains("Hdi").should("not.exist");
    cy.contains("table", "Language")
      .find("tr:nth-child(2)")
      .should("have.text", "ZulgoEzraConsultant Check in Progress2017-05-29");

    cy.contains("Save").click();
    cy.placeholder("Report Name").type("Zulgo Translation 2017");
    cy.contains("button", "Save").click();
    cy.contains("h2", "Zulgo Translation 2017");
    cy.contains("Created by Drew Mambo");
    cy.visit("/reports");
    cy.contains("a", "Zulgo Translation 2017");
  });
});
