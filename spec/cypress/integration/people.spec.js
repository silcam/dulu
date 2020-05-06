const kevinPath = "/people/732959017";
const rickPath = "/people/334915632";
const olgaPath = "/people/871827871";
const nancyPath = "/people/121345671";

describe("People", () => {
  beforeEach(cy.appFixtures);

  it("Kevin edits self", () => {
    cy.login("kevin_barnes@sil.org");
    cy.visit(kevinPath);
    cy.actionBarIcon("editIcon").click();
    cy.byValue("Kevin").clear().type("Da Boss");
    cy.contains("Save").click();
    cy.contains("All changes saved");
    cy.contains("h2", "Da Boss Barnes");
    cy.contains("tr", "Barnes, Da Boss");
  });

  it("Creates person", () => {
    cy.login("rick_conrad@sil.org");
    cy.visit("/people");
    cy.icon("addIcon").click();
    cy.inLabel("First Name").type("William");
    cy.inLabel("Last Name").type("Wallace");
    cy.contains("Can log in to Dulu").click();
    cy.inLabel("Email").type("scotland_4ever@aol.com");
    cy.contains("Save").click();

    cy.contains("h2", "William Wallace");
    cy.contains("scotland_4ever@aol.com");
    cy.contains("tr", "Dulu Account").should("contain", "Yes");
    cy.contains("tr", "Wallace, William");

    cy.login("scotland_4ever@aol.com");
    cy.visit("/");
    cy.contains("William");
    cy.request("POST", "/logout");
  });

  it("Handles Duplicates", () => {
    cy.login("rick_conrad@sil.org");
    cy.visit("/people");
    cy.icon("addIcon").click();
    cy.inLabel("First Name").type("Drew");
    cy.inLabel("Last Name").type("Mambo");
    cy.contains("Save").click();

    cy.contains("Drew Mambo may already exist");
    cy.contains("button", "Save").should("be.disabled");
    cy.contains("This is a different person").click();
    cy.contains("Save").click();
  });

  it("Adds, updates, removes organization", () => {
    cy.login("rick_conrad@sil.org");
    cy.visit(rickPath);
    cy.contains("div", "Rick Conrad").within(() => {
      cy.contains("h3", "Organizations")
        .parent()
        .within(() => {
          cy.contains("Lutheran").should("not.exist");
          cy.icon("addIcon").click();
          cy.get("input").searchFill("Lutheran");
          cy.contains("Save").click();
          cy.contains("a", "Lutheran Bible Translators");
          cy.contains("tr", "Lutheran Bible").within(() => {
            cy.icon("editIcon").click();
          });
          cy.inLabel("Position").type("Resident Baptist");
          cy.contains("div", "Start Date").within(() => {
            cy.fillFuzzyDate(2020, "Mar", 12);
          });
          cy.contains("Save").click();
          cy.contains("Save").should("not.exist");
          cy.contains("tr", "Lutheran Bible").within(() => {
            cy.contains("Resident Baptist");
            cy.contains("12 Mar 2020 - ");
          });
          cy.contains("tr", "Lutheran").within(() => {
            cy.icon("deleteIcon").click();
          });
          cy.contains("Lutheran").should("not.exist");
        });
    });
  });

  it("Adds Roles", () => {
    cy.login("rick_conrad@sil.org");
    cy.visit(kevinPath);
    cy.contains("div", "Roles").within(() => {
      cy.icon("addIcon").click();
      cy.get("select").select("Dulu Admin");
      cy.contains("Save").click();
    });
    cy.contains("Cancel").should("not.exist");
    cy.contains("tr", "Dulu Admin");
  });

  it("Removes roles", () => {
    cy.login("rick_conrad@sil.org");
    cy.visit(olgaPath);
    cy.contains("div", "Roles").within(() => {
      cy.contains("tr", "Language Program Facilitator").within(() => {
        cy.icon("deleteIcon").click();
      });
      cy.contains("tr", "Language Program Facilitator").should("not.exist");
    });
  });

  it("Deletes Olga", () => {
    cy.login("rick_conrad@sil.org");
    cy.visit(olgaPath);
    cy.contains("tr", "Ngombo, Olga");
    cy.actionBarIcon("deleteIcon").click();
    cy.contains("I'm sure").click();
    cy.contains("Permanently Delete Olga Ngombo").click();
    cy.location("pathname").should("eq", "/people");
    cy.contains("tr", "Mambo, Drew");
    cy.contains("tr", "Ngombo, Olga").should("not.exist");
  });

  it("Changes language", () => {
    cy.login("kevin_barnes@sil.org");
    cy.visit(kevinPath);
    cy.contains("tr", "Preferred language").find("select").select("Français");
    cy.contains("Pays d'origine");
  });

  it("Unsubscribes notification channels", () => {
    cy.login("fancy_nancy@sil.org");
    cy.visit(nancyPath);
    cy.contains("tr", "Notification Channels").within(() => {
      cy.contains("Translation").click();
      cy.contains("Translation").should("not.exist");
    });
  });

  it("Subscribes notification channels", () => {
    cy.login("rick_conrad@sil.org");
    cy.visit(rickPath);
    cy.contains("tr", "Notification Channels")
      .find("td")
      .should("have.text", "");

    cy.contains("tr", "Add Channel").find("select").select("Language");
    cy.placeholder("Add Language").type("Ewond");
    cy.contains("Ewondo").click();
    cy.contains("tr", "Notification Channels").should("contain", "Ewondo");

    cy.contains("tr", "Add Channel").find("select").select("Cluster");
    cy.placeholder("Add Cluster").type("Ndo");
    cy.contains("Ndop").click();
    cy.contains("tr", "Notification Channels").should("contain", "Ndop");

    cy.contains("tr", "Add Channel").find("select").select("Region");
    cy.placeholder("Add Region").type("North");
    cy.contains("North Region").click();
    cy.contains("tr", "Notification Channels").should(
      "contain",
      "North Region"
    );

    cy.contains("tr", "Add Channel").find("select").select("Domain");
    cy.contains("select", "Literacy").select("Literacy");
    cy.contains("button", "Add").click();
    cy.contains("tr", "Notification Channels").should("contain", "Literacy");
  });

  it("Olga's View", () => {
    cy.login("olga_ngombo@sil.org");
    cy.visit(kevinPath);
    cy.actionBarIcon("editIcon");
    cy.actionBarIcon("deleteIcon").should("not.exist");
  });
});
