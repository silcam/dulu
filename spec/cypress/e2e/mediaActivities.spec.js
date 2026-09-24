const bangolanPath = "/languages/248732538";
// const hdiPath = "/languages/876048951";

describe("Media Activity", () => {
  before(cy.appFixtures);

  it("Creates Audio John", () => {
    cy.login();
    cy.visit(bangolanPath + "/Media");
    cy.contains("Activities").within(() => {
      cy.icon("addIcon").click();
    });
    cy.inLabel("Category").select("Audio Scripture");
    cy.inLabel("Contents").select("Other");
    cy.contains("div", "Books").within(() => {
      cy.icon("addIcon").click();
      cy.get("select").select("John");
      cy.contains("button", "Add").click();
    });
    cy.contains("Save").click();
    cy.contains("tr", "Audio Scripture").should("contain", "Planned");
    cy.contains("Audio Scripture").click();
    cy.contains("h2", "John");
  });

  it("Creates Audio NT", () => {
    cy.login();
    cy.visit(bangolanPath + "/Media");
    cy.contains("Activities").within(() => {
      cy.icon("addIcon").click();
    });
    cy.inLabel("Category").select("Audio Scripture");
    cy.inLabel("Contents").select("New Testament");
    cy.contains("Save").click();
    cy.contains("tr", "Audio New Testament").should("contain", "Planned");
  });

  it("Creates Film", () => {
    cy.login();
    cy.visit(bangolanPath + "/Media");
    cy.contains("Activities").within(() => {
      cy.icon("addIcon").click();
    });
    cy.inLabel("Category").select("Film");
    cy.contains("select", "Lumo Mark").select("Lumo Mark");
    cy.contains("Save").click();
    cy.contains("tr", "Lumo Mark").should("contain", "Planned");
  });

  // it("Looks right", () => {
  //   cy.login();
  //   cy.visit(hdiPath + "/Media");
  // });
});
