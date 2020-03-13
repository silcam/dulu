const hdiPath = "/languages/876048951";

describe("The most excellent Literacy Domain Status Item", () => {
  before(cy.appFixtures);

  it("Adds COVID-19 Booklet", () => {
    addItem(
      dsiInfos({
        subcategory: "Informational Book",
        title: "Wash your hands"
      }),
      () => {
        cy.inLabel("Genre").select("Health");
      }
    );
    cy.contains("2020 Wash your hands").click();
    cy.contains("Wash your hands");
    cy.contains("This is the description");
    cy.contains("2020");
    cy.contains("a", "Andreas Everest");
    cy.contains("a", "SIL");
    cy.contains("Health");
  });
});

function addItem(infos, cb = () => {}) {
  cy.login();
  cy.visit(hdiPath + "/Literacy");
  cy.contains("h3", "Status")
    .parent()
    .within(() => {
      cy.icon("addIcon").click();
      cy.inLabel("Subcategory").select(infos.subcategory);
      cy.inLabel("Title").type(infos.title);
      cy.inLabel("Description").type(infos.description);
      cy.inLabel("Year").type(infos.year);
      infos.people.forEach(person => {
        cy.placeholder("Add Person").searchFill(person);
      });
      infos.organizations.forEach(org => {
        cy.placeholder("Add Organization").searchFill(org);
      });
      cb();
      cy.contains("Save").click();
    });
}

function dsiInfos(mods) {
  return {
    title: "This is the title",
    description: "This is the description",
    year: 2020,
    people: ["Andreas"],
    organizations: ["SIL"],
    ...mods
  };
}
