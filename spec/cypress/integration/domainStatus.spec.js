const hdiPath = "/languages/876048951";

describe("Domain Status Updates", () => {
  beforeEach(cy.appFixtures);

  it("Creates App", () => {
    cy.login();
    cy.visit(hdiPath + "/Translation");
    cy.contains("xed");
    cy.contains("h3", "Status")
      .parent()
      .within(_ => {
        cy.icon("addIcon").click();
        cy.inLabel("Category").select("Scripture App");
        cy.inLabel("Subcategory").select("Portions");
        cy.icon("addIcon").click();
        cy.contains("select", "Genesis").select("Ezra");
        cy.contains("Add").click();
        cy.contains("Android").click();
        cy.inLabel("Year").type("2010");
        cy.inLabel("Link").type("appstore.com/Hdi_Ezra");
        cy.placeholder("Add Person").type("Rick");
        cy.contains("Rick Conrad").click();
        cy.placeholder("Add Organization").type("SIL");
        cy.contains("SIL").click();
        cy.contains("Save").click();
      });
    cy.contains("a", "Android").click();
    cy.contains("Ezra");
    cy.contains("Android");
    cy.contains("2010");
    cy.contains("http://appstore.com/Hdi_Ezra");
    cy.contains("SIL");
    cy.contains("Rick Conrad");
  });

  it("Edits Hdi NT", () => {
    cy.login();
    cy.visit(hdiPath + "/Translation");
    cy.contains("a", "2005").click();
    cy.contains("Bible").should("not.exist");
    cy.actionBarIcon("editIcon").click();
    cy.inLabel("Subcategory").select("Bible");
    cy.contains("Save").click();
    cy.contains("h2", "Published Scripture: Bible");
  });

  it("Deletes Hdi NT DSI", () => {
    cy.login();
    cy.visit(hdiPath + "/Translation");
    cy.contains("xed");
    //cy.contains("h5", "New Testament").find("input").should("be.checked");
    cy.contains("h5","New Testament").should('have.css','font-weight','700');
    cy.contains("a", "2005").click();
    cy.actionBarIcon("deleteIcon").click();
    cy.location("pathname").should("eq", hdiPath);
    //cy.contains("h5", "New Testament").find("input").should("not.be.checked");
    cy.contains("h5","New Testament").should('have.css',"color","rgb(128, 128, 128)");
  });

  it("Kevin's view - no editing", () => {
    cy.login("kevin_barnes@sil.org");
    cy.visit(hdiPath + "/Translation");
    cy.contains("h3", "Status")
      .parent()
      .within(_ => {
        cy.icon("addIcon").should("not.exist");
      });
    cy.contains("a", "2005").click();
    cy.actionBarIcon("editIcon").should("not.exist");
    cy.actionBarIcon("deleteIcon").should("not.exist");
  });
});
