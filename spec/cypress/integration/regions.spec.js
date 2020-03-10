const northRegionPath = "/regions/944766880";

describe("Regions", () => {
  beforeEach(cy.appFixtures);

  it("Creates one", () => {
    cy.login("olga_ngombo@sil.org");
    cy.visit("/regions");
    cy.icon("addIcon").click();
    cy.placeholder("Name").type("Up Yonder");
    cy.contains("Save").click();
    cy.contains("h2", "Up Yonder");
    cy.contains("tr", "Up Yonder");
  });

  it("Deletes one", () => {
    cy.login("rick_conrad@sil.org");
    cy.visit(northRegionPath);
    cy.actionBarIcon("deleteIcon").click();
    cy.location("pathname").should("eq", "/regions");
    cy.contains("tr", "South Region");
    cy.contains("tr", "North Region").should("not.exist");
  });

  it("Updates name", () => {
    cy.login("olga_ngombo@sil.org");
    cy.visit(northRegionPath);
    cy.actionBarIcon("editIcon").click();
    cy.byValue("North Region")
      .clear()
      .type("El Norte!");
    cy.contains("Save").click();
    cy.contains("tr", "El Norte!");
    cy.contains("h2", "El Norte!");
  });

  it("Adds language", () => {
    cy.login("olga_ngombo@sil.org");
    cy.visit(northRegionPath);
    cy.actionBarIcon("editIcon").click();
    cy.placeholder("Add Language").type("Ewond");
    cy.contains("li", "Ewondo").click();
    cy.contains("Save").click();
    cy.contains("a", "Ewondo");
  });

  it("Removes language", () => {
    cy.login("olga_ngombo@sil.org");
    cy.visit(northRegionPath);
    cy.contains("a", "Hdi").should("exist");
    cy.actionBarIcon("editIcon").click();
    cy.contains("tr", "Hdi").within(() => {
      cy.icon("deleteIcon").click();
    });
    cy.contains("Save").click();
    cy.contains("a", "Zulgo").should("exist");
    cy.contains("a", "Hdi").should("not.exist");
  });

  it("Adds and removes cluster", () => {
    cy.login("olga_ngombo@sil.org");
    cy.visit(northRegionPath);
    cy.contains("a", "Zulgo").should("exist");
    cy.actionBarIcon("editIcon").click();
    cy.placeholder("Add Cluster").type("Ndop");
    cy.contains("li", "Ndop").click();
    cy.contains("Save").click();
    cy.contains("a", "Ndop");

    cy.actionBarIcon("editIcon").click();
    cy.contains("tr", "Ndop").within(() => {
      cy.icon("deleteIcon").click();
    });
    cy.contains("Save").click();
    cy.contains("a", "Zulgo").should("exist");
    cy.contains("a", "Ndop").should("not.exist");
  });

  it("Changes LPF", () => {
    cy.login("olga_ngombo@sil.org");
    cy.visit(northRegionPath);
    cy.actionBarIcon("editIcon").click();
    cy.inLabel("LPF")
      .clear()
      .type("Drew Mambo");
    cy.contains("li", "Drew Mambo").click();
    cy.contains("Save").click();
    cy.contains("LPF: Drew Mambo");
  });

  it("Removes LPF", () => {
    cy.login("olga_ngombo@sil.org");
    cy.visit(northRegionPath);
    cy.contains("LPF: Andreas");
    cy.actionBarIcon("editIcon").click();
    cy.inLabel("LPF").clear();
    cy.contains("Save").click();
    cy.contains("LPF").should("not.exist");
  });

  it("Olga's View", () => {
    cy.login("olga_ngombo@sil.org");
    cy.visit(northRegionPath);
    cy.icon("editIcon");
    cy.icon("deleteIcon").should("not.exist");
  });

  it("Drew's View", () => {
    cy.login();
    cy.visit(northRegionPath);
    cy.contains("Andreas");
    cy.icon("editIcon").should("not.exist");
  });
});
