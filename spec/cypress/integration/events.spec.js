const genesisConsultPath = "/events/704985269";

describe("The Events", () => {
  beforeEach(cy.appFixtures);

  it("Creates events", () => {
    cy.login("kendall_ingles@sil.org");
    cy.visit("/events");
    cy.icon("addIcon").click();
    cy.placeholder("Name").type("Taco Party");
    cy.inLabel("Domain").select("Community Development");
    cy.contains("div", "Start Date").within(() => {
      cy.fillFuzzyDate(2017, "Jul", 1);
    });
    cy.contains("div", "End Date").within(() => {
      cy.fillFuzzyDate(2017, "Jul", 1);
    });
    cy.inLabel("Location").click();
    cy.contains("li", "Mbouda").click();
    cy.inLabel("Note").type("Boatloads of tacos!");
    cy.contains("Save").click();

    cy.visit("/events/cal/2017/7");
    cy.contains("h4", "Taco Party")
      .parent()
      .within(() => {
        cy.contains("1 Jul 2017");
        cy.contains("Boatloads of tacos!");
        cy.contains("Mbouda");
      });
  });

  it("Edits event name", () => {
    setupEdit();
    cy.byValue("Genesis Checking")
      .clear()
      .type("Taco Party");
    cy.contains("Save").click();
    cy.contains("h2", "Taco Party");
  });

  it("Edits event dates", () => {
    setupEdit();
    cy.contains("div", "Start Date").within(() => {
      cy.fillFuzzyDate(2017, "Feb");
    });
    cy.contains("div", "End Date").within(() => {
      cy.fillFuzzyDate(2018, "Feb");
    });
    cy.contains("Save").click();
    cy.contains("Feb 2017 - Feb 2018");
  });

  it("Edits event location", () => {
    setupEdit();
    cy.inLabel("Location").click();
    cy.contains("li", "Mbouda").click();
    cy.contains("Save").click();
    cy.contains("Save").should("not.exist");
    cy.contains("Mbouda");
  });

  it("Edits event location, creating a new one", () => {
    setupEdit();
    cy.inLabel("Location")
      .click()
      .clear()
      .type("Drew's back yard");
    cy.contains("Save").click();
    cy.contains("Save").should("not.exist");
    cy.contains("Drew's back yard");
  });

  it("Adds languages", () => {
    setupEdit();
    cy.placeholder("Add Language").type("Ewond");
    cy.contains("Ewondo").click();
    cy.contains("Save").click();
    cy.contains("a", "Ewondo");
  });

  it("Removes languages", () => {
    setupEdit();
    cy.contains("tr", "Hdi").within(() => {
      cy.icon("deleteIcon").click();
    });
    cy.contains("Save").click();
    cy.contains("tr", "Languages").should("contain", "None");
  });

  it("Adds and removes clusters", () => {
    setupEdit();
    cy.placeholder("Add Cluster").type("Ndo");
    cy.contains("Ndop").click();
    cy.contains("Save").click();
    cy.contains("a", "Ndop");

    cy.icon("editIcon").click();
    cy.contains("tr", "Ndop").within(() => {
      cy.icon("deleteIcon").click();
    });
    cy.contains("Save").click();
    cy.contains("tr", "Clusters").should("contain", "None");
  });

  it("Adds Rick", () => {
    setupEdit();
    cy.placeholder("Add Person").type("Rick");
    cy.contains("Rick Conrad").click();
    cy.contains("table", "Roles").within(() => {
      cy.contains("tr", "Rick Conrad").within(() => {
        cy.icon("addIcon").click();
        cy.get("select").select("Facilitator");
      });
    });
    cy.contains("Save").click();
    cy.contains("a", "Rick Conrad");
    cy.contains("Rick Conrad (Facilitator)");
  });

  it("Removes Abanda", () => {
    setupEdit();
    cy.contains("tr", "Abanda").within(() => {
      cy.icon("deleteIcon").click();
    });
    cy.contains("Abanda").should("not.exist");
    cy.contains("Save").click();
    cy.contains("Abanda").should("not.exist");
  });

  it("Deletes events", () => {
    cy.login();
    cy.visit("/events/cal/2018/1");
    cy.contains("a", "Genesis Checking").click();
    cy.icon("deleteIcon").click();
    cy.location("pathname").should("eq", "/events/cal/2018/1");
    cy.contains("a", "Workshop: Noun");
    cy.contains("a", "Genesis Checking").should("not.exist");
  });

  it("Deletes events that I created", () => {
    cy.login("lance_armstrong@sil.org");
    cy.visit("/events/cal/2019/1");
    cy.contains("a", "Lance's Event").click();
    cy.icon("deleteIcon").click();
    cy.location("pathname").should("eq", "/events/cal/2019/1");
    cy.contains("a", "Lance's Event").should("not.exist");
  });

  it("Kevin's view, no add", () => {
    cy.login("kevin_barnes@sil.org");
    cy.visit("/events");
    cy.icon("addIcon").should("not.exist");
  });

  it("Lance's view of Genesis Consult - no edit/delete", () => {
    cy.login("lance_armstrong@sil.org");
    cy.visit(genesisConsultPath);
    cy.contains("h2", "Genesis Checking");
    cy.icon("editIcon").should("not.exist");
    cy.icon("deleteIcon").should("not.exist");
  });
});

function setupEdit() {
  cy.login();
  cy.visit(genesisConsultPath);
  cy.icon("editIcon").click();
}
