describe("Logging in and out", () => {
  before(() => {
    cy.appFixtures();
    cy.request("POST", "/logout");
  });

  it("Logs in and out", () => {
    cy.mockOauth();
    cy.visit("/");
    cy.contains("Welcome to Dulu").should("exist");
    // A button inside a button_to form now, not an <a>: OmniAuth 2 requires the
    // request phase to be POSTed.
    cy.get("button#google-signin-link")
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
    // A logged-out deep link used to bounce straight through to Google. Under
    // OmniAuth 2 it renders the welcome page and the sign-in button has to be
    // clicked -- but session[:original_request] still carries the destination
    // across the OAuth round trip, which is what this test is really checking.
    cy.visit("/organizations");
    cy.contains("Welcome to Dulu").should("exist");
    cy.get("button#google-signin-link")
      .find("img:visible")
      .click();
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
