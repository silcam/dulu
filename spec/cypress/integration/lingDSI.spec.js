const hdiPath = "/languages/876048951";

describe("The venerable Linguistic Domain Status Item", () => {
  before(cy.appFixtures);

  it("Adds Phonologie DSI", () => {
    addItem("Phonology");
    goToItem("Phonology");
  });

  it("Adds Orthography DSI", () => {
    addItem("Orthography", () => {
      cy.contains("Tone Orthography").click();
    });
    goToItem("Orthography");
    cy.contains("th", "Tone Orthography")
      .parent()
      .should("contain", "Yes");
  });

  it("Adds Grammar DSI", () => {
    addItem("Grammar", () => {
      cy.contains("Noun Phrase").click();
    });
    goToItem("Grammar");
    cy.inLabel("Noun Phrase").should("be.checked");
    cy.inLabel("Verb Phrase").should("not.be.checked");
  });

  it("Adds Discourse DSI", () => {
    addItem("Discourse", () => {
      cy.contains("Narrative").click();
    });
    goToItem("Discourse");
    cy.inLabel("Narrative").should("be.checked");
    cy.inLabel("Hortatory").should("not.be.checked");
  });

  it("Adds Lexicon DSI", () => {
    addItem("Lexicon", () => {
      cy.inLabel("Total Words").type("800");
    });
    cy.contains("a", "800 words 1995").click();
    cy.contains("800");
    cy.contains("1995").click();
    cy.contains("Cool Lexicon");
  });

  it("Adds Text DSI", () => {
    addItem("Texts", () => {
      cy.inLabel("Total Texts").type("5");
      cy.contains("tr", "Narrative")
        .find("input")
        .type("3");
      cy.contains("tr", "Hortatory")
        .find("input")
        .type("2");
    });
    cy.contains("5 texts 1995").click();
    cy.contains("Draft");
    cy.contains("3 Narrative");
    cy.contains("2 Hortatory");
    cy.contains("a", "1995").click();
    cy.contains("Cool Texts");
  });

  it("Creates a new DSI Location for new Phonology", () => {
    addItem("Phonology", () => {
      cy.inLabel("Year")
        .clear()
        .type("1985");
      cy.inLabel("Location")
        .clear()
        .type("Random File Cabinet Somewhere");
    });
    cy.contains("1985").click();
    cy.contains("Random File Cabinet Somewhere");
    cy.actionBarIcon("editIcon").click();
    cy.inLabel("Location")
      .click()
      .clear();
    cy.contains("li", "Random File Cabinet Somewhere");
  });
});

function goToItem(subcategory) {
  cy.contains("h5", subcategory)
    .parent()
    .within(() => {
      cy.contains("Rick Conrad").click();
    });
  cy.contains(`Cool ${subcategory}`);
  cy.contains("REAP");
}

function addItem(subcategory, cb = () => {}) {
  cy.login();
  cy.visit(hdiPath + "/Linguistics");
  cy.contains("h3", "Status")
    .parent()
    .within(() => {
      cy.icon("addIcon").click();
      cy.inLabel("Subcategory").select(subcategory);
      cy.inLabel("Description")
        .type("Cool ")
        .type(subcategory);
      cy.inLabel("Year").type("1995");
      cy.inLabel("Location").click();
      cy.contains("li", "REAP").click();
      cy.placeholder("Add Person").type("Rick");
      cy.contains("Rick Conrad").click();
      cb();
      cy.contains("Save").click();
    });
}
