const silPath = "/organizations/show/258650127";

describe("Organizations Picker", () => {
  it("Adds new organization in picker", () => {
    cy.login("olga_ngombo@sil.org");
    cy.visit(silPath);
    cy.icon("editIcon").click();
    cy.contains("li", "Parent Organization").within(() => {
      cy.get("input").type("wycliffe alliance");
      cy.contains("Add Organization").click();
      cy.contains("New Organization");
      cy.contains("Save").click();
      cy.contains("New Organization").should("not.exist");
    });

    cy.contains("Save").click();
    cy.contains("li", "Parent Organization").should(
      "contain",
      "Wycliffe Alliance"
    );
    cy.contains("tr", "Wycliffe Alliance");
  });
});
