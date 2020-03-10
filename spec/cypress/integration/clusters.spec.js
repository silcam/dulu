const ndopPath = "/clusters/657561020";

describe("Clusters", () => {
  beforeEach(cy.appFixtures);

  it("Creates cluster", () => {
    cy.login("olga_ngombo@sil.org");
    cy.visit("/clusters");
    cy.icon("addIcon").click();
    cy.placeholder("Name").type("Kluster");
    cy.contains("Save").click();
    cy.contains("h2", "Kluster");
    cy.contains("td", "Kluster");
  });

  it("Deletes cluster", () => {
    cy.login("rick_conrad@sil.org");
    cy.visit("/clusters");
    cy.contains("tr", "Ndop").click();
    cy.actionBarIcon("deleteIcon").click();
    cy.contains("Ndop").should("not.exist");
    cy.request("/api/clusters").then(response => {
      expect(response.body.clusters.length).to.equal(0);
    });
  });

  it("Updates cluster name", () => {
    cy.login("olga_ngombo@sil.org");
    cy.visit(ndopPath);
    cy.actionBarIcon("editIcon").click();
    cy.byValue("Ndop")
      .clear()
      .type("Misaje");
    cy.contains("Save").click();
    cy.contains("h2", "Misaje");
    cy.contains("tr", "Misaje");
  });

  it("Adds languages to clusters", () => {
    cy.login("olga_ngombo@sil.org");
    cy.visit(ndopPath);
    cy.contains("a", "Bambalang");
    cy.contains("a", "Ewondo").should("not.exist");
    cy.actionBarIcon("editIcon").click();
    cy.placeholder("Add Language").type("Ewond{Enter}");
    cy.contains("Save").click();
    cy.contains("a", "Ewondo");
  });

  it("Removes languages from cluster", () => {
    cy.login("olga_ngombo@sil.org");
    cy.visit(ndopPath);
    cy.contains("a", "Bangolan");
    cy.actionBarIcon("editIcon").click();
    cy.contains("tr", "Bangolan").within(_ => {
      cy.icon("deleteIcon").click();
    });
    cy.contains("Save").click();
    cy.contains("a", "Bangolan").should("not.exist");
  });

  it("Adds cluster participants", () => {
    cy.login("olga_ngombo@sil.org");
    cy.visit(ndopPath);
    cy.contains("h3", "People")
      .parent()
      .within(_ => {
        cy.icon("addIcon").click();
        cy.placeholder("Name").type("Lance Arm{Enter}");
        cy.fillFuzzyDate(2016, "Jul", 31);
        cy.contains("Save").click();
      });
    cy.contains("h2", "Lance Armstrong");
    cy.contains("Translation Consultant");
    cy.contains("tr", "Joined Program").should("contain", "2016-07-31");
  });

  it("Doesn't let Olga delete clusters", () => {
    cy.login("olga_ngombo@sil.org");
    cy.visit(ndopPath);
    cy.actionBarIcon("editIcon");
    cy.actionBarIcon("deleteIcon").should("not.exist");
  });
});
