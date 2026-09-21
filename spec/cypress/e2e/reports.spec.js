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

    // Editing a saved report is the only place in the app that carries router
    // location state: SavedReportViewer pushes the report as the second
    // positional argument to history.push, and ReportViewer reads it back off
    // location.state. React Router 6 changes that call's *shape* --
    // navigate(to, { state }) -- rather than just its name, so it is worth
    // having under test before the conversion.
    cy.actionBarIcon("editIcon").click();
    cy.location("pathname").should("include", "/reports/new/");
    cy.contains("h3", "Ndop");
    cy.contains("h4", "Hdi");
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

    // Positional again. Both rows carry start_date 2017-05-29, and until Phase 8d item 5
    // gen_activity_items ordered by `start_date: :desc` alone -- not a total order, so
    // Postgres could return them either way round and this spec was loosened to assert
    // only that both rows exist. The query now breaks the tie on `id`, so the order is
    // fixed and worth pinning: Hdi's stage has the lower id, so it comes first.
    cy.contains("table", "Language")
      .find("tr:nth-child(2)")
      .should("have.text", "HdiGenesisConsultant Check in Progress2017-05-29");
    cy.contains("table", "Language")
      .find("tr:nth-child(3)")
      .should("have.text", "ZulgoEzraConsultant Check in Progress2017-05-29");
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
