// Ambient declaration for CSS Modules, replacing the 34 checked-in `*.css.d.ts` files
// that `typings-for-css-modules-loader` used to generate. See UPGRADE_PLAN.md Phase 2d.
//
// This trades per-class type safety for an index signature: `styles.contaner` is no
// longer a compile error. That was already only partly enforced -- AlertBox, StyledTable,
// StyledText and icons/Icon index with a computed key (`styles[styleClass]`), which no
// generated typing could check either. `spec/cypress/integration/cssModules.spec.js` is
// what actually guards this now.
declare module "*.css" {
  const styles: { [className: string]: string };
  export default styles;
}
