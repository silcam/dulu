// The Domain branch of MyNotificationChannels had no coverage at all. It sits behind
// the "Add Channel" type selector -- you have to pick "Domain" before the dropdown
// and its Add button render -- so nothing in the suite ever reached it.
//
// Written against the pre-change code on purpose (UPGRADE_PLAN 8c, family A): the
// component's selection was `useState(domainOpts[0] || "")` corrected by a
// dependency-less useEffect, and is becoming a value derived during render. A test
// written after the change would only prove the new code does what the new code
// does. This documents the behaviour both are supposed to have.
//
// The fallback is the part worth pinning down. `domainOpts` is Domains minus
// whatever is already subscribed, so adding the selected domain removes it from the
// options and the selection has to move to something still on offer.
//
// Note on the labels: config/locales/en.json has no entries for AddChannel,
// NotificationChannels, Domain or Add, so i18n's `t` falls through to
// spaceAndCapitalize() and the UI shows the key names -- "Add Channel", not a
// translation. Asserting on what is rendered, not on what was intended.

// Drew, who is `cy.login()`'s default user -- DuluSettings renders only for
// `person.isUser`, so this has to be the logged-in person's own page.
const drewPath = "/people/883742519";

const channelsRow = () => cy.contains("tr", "Notification Channels");
const addRow = () => cy.contains("tr", "Add Channel");
const domainSelect = () => addRow().find("select").eq(1);

describe("Notification Channels", () => {
  before(cy.appFixtures);

  it("Adds a domain channel, and the dropdown drops what was added", () => {
    cy.login();
    cy.visit(drewPath);

    // Drew's fixture channels are a language and a cluster, no domains.
    channelsRow().should("not.contain", "Literacy");

    addRow()
      .find("select")
      .first()
      .select("Domain");

    // Deliberately not the first option. Drew has no domains, so the dropdown opens
    // on Anthropology; picking a later one proves the selection is the user's choice
    // rather than always the head of the list.
    domainSelect().select("Literacy");
    addRow()
      .contains("button", "Add")
      .click();

    channelsRow().should("contain", "Literacy");

    // The fallback. Literacy is no longer available, so the selection must have
    // moved to one that is -- Anthropology, being first in the Domains list.
    domainSelect().should("have.value", "Anthropology");
    domainSelect().should("not.contain", "Literacy");

    // And adding again adds the new selection, not the stale one.
    addRow()
      .contains("button", "Add")
      .click();
    channelsRow().should("contain", "Anthropology");
  });

  it("Persists the channels, and removing one puts it back on offer", () => {
    cy.login();
    cy.visit(drewPath);

    // Each Add saves immediately via updatePersonAndSave, so a fresh page load is
    // the real check that the PUT landed rather than just the local state changing.
    channelsRow().should("contain", "Literacy");
    channelsRow().should("contain", "Anthropology");

    // The chips are buttons; clicking one removes that channel and saves.
    addRow()
      .find("select")
      .first()
      .select("Domain");
    channelsRow()
      .contains("button", "Literacy")
      .click();
    channelsRow().should("not.contain", "Literacy");
    domainSelect().should("contain", "Literacy");

    // Leave Drew as the fixtures had him -- this spec sorts immediately before
    // notifications.spec.js, which reads his feed. (That spec reloads the fixtures
    // itself, so this is belt-and-braces rather than load-bearing.)
    channelsRow()
      .contains("button", "Anthropology")
      .click();
    cy.reload();
    channelsRow().should("not.contain", "Anthropology");
    channelsRow().should("not.contain", "Literacy");
  });
});
