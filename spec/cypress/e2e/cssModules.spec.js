// CSS Modules gate. Added in Phase 2 of the Rails 8 upgrade (see UPGRADE_PLAN.md).
//
// Nothing else in any suite can see CSS Modules break. Jest maps `*.css` to a stub, and
// every other Cypress assertion selects by text, so the whole app can ship with each
// `className={styles.x}` evaluating to `undefined` and all 92 E2E tests plus all 125 Jest
// tests still pass. The webpacker 3 -> shakapacker ladder walks through several
// css-loader/style-loader majors that each changed the CSS-Modules-to-JS interop
// (notably the `namedExport` default), so this file exists to fail loudly at the hop that
// breaks it rather than silently at deploy.
//
// It checks the two halves of the interop separately, because they break separately:
//   1. JS side  - `styles.foo` produced a real scoped name, not `undefined`.
//   2. CSS side - a rule for that exact generated name reached the browser and applied.
// Only (2) catches the case where hashed CSS is emitted correctly but JS gets nothing.

// From `localIdentName: "[name]__[local]___[hash:base64:5]"` in config/webpack/environment.js.
// If the migration deliberately changes localIdentName, update these patterns; do not
// loosen them to the point that `undefined` would pass.
const scopedName = (file, klass) =>
  new RegExp(`^${file}__${klass}___[A-Za-z0-9_+/-]{5}$`);

describe("CSS Modules", () => {
  before(cy.appFixtures);

  // One visit for both halves of the check. The dashboard's tables arrive over the API
  // after first paint, so the table lookup carries an explicit generous timeout rather
  // than relying on the default.
  it("resolves scoped class names that are actually styled", () => {
    cy.login();
    cy.visit("/");

    // 1. Plain `styles.container` on DuluApp's root div, present on every page.
    cy.get("#app > div")
      .should($el => {
        expect($el.attr("class"), "root div class attribute").to.match(
          scopedName("DuluApp", "container")
        );
      })
      .should("have.css", "display", "flex");

    // 2. StyledTable - bracket access `styles[styleClass]` rather than dot access, and
    //    StyledTable.css uses `composes:`, which only works if the file is processed as
    //    a CSS Module at all.
    cy.contains("tr", "Bangolan", { timeout: 20000 })
      .parents("table")
      .first()
      .should($el => {
        expect($el.attr("class"), "table class attribute").to.match(
          scopedName("StyledTable", "normal")
        );
      })
      .should("have.css", "border-collapse", "collapse");
  });
});
