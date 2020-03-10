const northRegionPath = "/regions/944766880";

describe("People Picker", () => {
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
});
