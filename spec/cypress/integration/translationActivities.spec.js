const zulgoPath = "/languages/505201461";
const hdiPath = "/languages/876048951";
const hdiEzraPath = "/languages/876048951/activities/1071624995";

describe("Translation Activity", () => {
  beforeEach(cy.appFixtures);

  it("Creates a new one", () => {
    cy.login("olga_ngombo@sil.org");
    cy.visit(zulgoPath + "/Translation");
    cy.contains("Genesis").should("not.exist");
    cy.contains("h3", "Activities").within(() => {
      cy.icon("addIcon").click();
    });
    cy.get("select").select("Genesis");
    cy.contains("Save").click();
    cy.contains("tr", "Genesis").should("contain", "Planned");
    cy.contains("tr", "Genesis").find('td:nth-child(3)').should('be.empty')
  });

  it("Updates the stage", () => {
    cy.login();
    cy.visit(hdiPath + "/Translation");
    cy.contains("tr", "Ezra").within(() => {
      cy.contains("Drafting").click();
    });
    cy.contains("tr", "Update Stage").within(() => {
      cy.get("select").select("Ready for Consultant Check");
      cy.contains("button", "Update").click();
      cy.fillFuzzyDate(2020, "Mar", 12);
      cy.contains("button", "Save").click();
    });
    cy.contains("tr", "Ezra")
      .should("contain", "Ready for Consultant Check")
      .should("contain", "2020-03-12");
  });

  it("Updates stage date", () => {
    cy.login();
    cy.visit(hdiEzraPath);
    cy.contains("tr", "Drafting").within(() => {
      cy.icon("editIcon").click();
      cy.fillFuzzyDate(2018, "Apr", 2);
      cy.contains("Save").click();
      cy.contains("2018-04-02");
    });
  });

  it("Dates show on refresh", () => {
    cy.login();
    cy.visit(hdiPath + "/Translation");
    cy.contains("tr", "Genesis").find('td:nth-child(3)').should("contain", '2017-05-29');
    cy.contains("tr", "Ezra").find('td:nth-child(3)').should('contain', '2017-02')
  });

  it("Deletes stages", () => {
    cy.login();
    cy.visit(hdiEzraPath);
    cy.contains("tr", "Drafting").within(() => {
      cy.icon("deleteIcon").click();
    });
    cy.contains("tr", "Planned").should("exist");
    cy.contains("tr", "Drafting").should("not.exist");
  });

  it("Kendall's view", () => {
    cy.login("kendall_ingles@sil.org");
    cy.visit(hdiPath + "/Translation");
    cy.contains("tr", "Ezra").within(() => {
      cy.contains("Drafting");
      cy.contains("button", "Drafting").should("not.exist");
    });
    cy.contains("h3", "Events").within(() => {
      cy.icon("addIcon").should("exist");
    });
    cy.contains("h3", "Activities").within(() => {
      cy.icon("addIcon").should("not.exist");
    });
  });
});
