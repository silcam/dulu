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
