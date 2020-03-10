describe("Logging in and out", () => {
  before(() => {
    cy.appFixtures();
    cy.request("POST", "/logout");
  });

  it("Logs in and out", () => {
    cy.mockOauth();
    cy.visit("/");
    cy.contains("Welcome to Dulu").should("exist");
    cy.get("a#google-signin-link")
      .find("img:visible")
      .click();
    // cy.get("img.img-normal[alt='Sign in with Google']").click();
    cy.contains("Drew").should("exist");

    cy.wait(300); // Not sure why...
    cy.contains("Logout").click();
    cy.contains("Welcome to Dulu").should("exist");
  });

  it("Does redirects", () => {
    cy.mockOauth();
    cy.contains("Welcome to Dulu").should("exist");
    cy.visit("/organizations");
    cy.url().should("include", "organizations");

    cy.wait(300); // Not sure why...
    cy.contains("Logout").click();
  });

  it("Rejects invalid login", () => {
    cy.mockOauth("bad_hacker@gmail.com");
    cy.visit("/");
    cy.contains("Welcome to Dulu").should("exist");
    cy.get("img.img-normal[alt='Sign in with Google']").click();
    cy.contains(
      "Sorry, but no one is authorized to log in to Dulu with the address bad_hacker@gmail.com. Are you using the correct SIL email address?"
    ).should("exist");
  });
});
