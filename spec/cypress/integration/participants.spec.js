const hdiPath = "/languages/876048951";
const drewHdiPath = "/languages/876048951/participants/126806499";
const hdiGenesisPath = "/languages/876048951/activities/942111097";
const hdiEzraPath = "/languages/876048951/activities/1071624995";
const zulgoPath = "/languages/505201461";

describe("Those Participants...", () => {
  beforeEach(() => {
    cy.appFixtures();
    cy.login("rick_conrad@sil.org");
  });

  it("Removes role", () => {
    cy.visit(drewHdiPath);
    cy.contains("Translation Consultant");
    cy.actionBarIcon("editIcon").click();
    cy.contains("tr", "Translation Consultant").within(() => {
      cy.icon("deleteIcon").click();
    });
    cy.contains("Save").click();
    cy.contains("Translation Consultant").should("not.exist");
    cy.contains("No roles assigned");
  });

  it("Adds role", () => {
    cy.visit(drewHdiPath);
    cy.contains("Translation Consultant");
    cy.contains("Linguist").should("not.exist");
    cy.actionBarIcon("editIcon").click();
    cy.contains("table", "Translation Consultant").within(() => {
      cy.get("select").select("Linguist");
      cy.icon("addIcon").click();
    });
    cy.contains("Save").click();
    cy.contains("Translation Consultant, Linguist");
  });

  it("Adds activity", () => {
    cy.visit(hdiGenesisPath);
    cy.contains("Abanda");
    cy.contains("Drew Mambo").should("not.exist");
    cy.contains("h3", "People")
      .find("svg")
      .click();
    cy.get("select").select("Drew Mambo");
    cy.contains("Add").click();
    cy.contains("Save").click();
    cy.contains("li", "Drew Mambo").should("contain", "Translation Consultant");
  });

  it("Removes Activity", () => {
    cy.visit(hdiEzraPath);
    cy.contains("a", "Drew Mambo");
    cy.contains("h3", "People")
      .find("svg")
      .click();
    cy.contains("tr", "Drew Mambo").within(() => {
      cy.icon("deleteIcon").click();
    });
    cy.contains("Save").click();
    cy.contains("a", "Abanda");
    cy.contains("a", "Drew Mambo").should("not.exist");
  });

  it("Deletes Drew", () => {
    cy.visit(hdiPath + "/Translation");
    cy.contains("Drew Mambo").click();
    cy.actionBarIcon("deleteIcon").click();
    cy.location("pathname").should("eq", hdiPath);
    cy.contains("a", "Abanda");
    cy.contains("a", "Drew Mambo").should("not.exist");
  });

  it("Adds, edits and finishes Drew", () => {
    cy.visit(zulgoPath + "/Translation");
    cy.contains("h3", "People")
      .parent()
      .within(() => {
        cy.icon("addIcon").click();
        cy.placeholder("Name").type("Drew Mamb");
        cy.contains("Drew Mambo").click();
        cy.fillFuzzyDate(2016, "Jul", 31);
        cy.contains("Save").click();
      });
    cy.contains("h2", "Drew Mambo");
    cy.contains("Translation Consultant");
    cy.contains("tr", "Joined Program").should("contain", "2016-07-31");

    // Edit
    cy.actionBarIcon("editIcon").click();
    cy.contains("tr", "Joined Program").within(() => {
      cy.fillFuzzyDate(2016, "Aug", 31);
    });
    cy.contains("Save").click();
    cy.contains("tr", "Joined Program").should("contain", "2016-08-31");

    // Finish
    cy.actionBarIcon("editIcon").click();
    cy.contains("tr", "Left Program").within(() => {
      cy.fillFuzzyDate(2017, "Jul", 31);
    });
    cy.contains("Save").click();
    cy.contains("tr", "Left Program").should("contain", "2017-07-31");
  });

  it("Kevin's view", () => {
    cy.login("kevin_barnes@sil.org");
    cy.visit(hdiEzraPath);
    cy.contains("Drafting");
    cy.icon("editIcon").should("not.exist");
  });
});
