import { pageDiagnostics } from './commands';

// CypressOnRails: dont remove these command
// Endpoint is /__e2e__/command, not the pre-1.17 /__cypress__/command. Both are
// still routed by the middleware, but the old path logs a deprecation on every
// single app command -- which is once or more per test.
Cypress.Commands.add('appCommands', function (body) {
  cy.log("APP: " + JSON.stringify(body))
  return cy.request({
    method: 'POST',
    url: "/__e2e__/command",
    body: JSON.stringify(body),
    log: true,
    failOnStatusCode: true
  }).then((response) => {
    return response.body
  });
});

Cypress.Commands.add('app', function (name, command_options) {
  return cy.appCommands({name: name, options: command_options}).then((body) => {
    return body[0]
  });
});

Cypress.Commands.add('appScenario', function (name, options = {}) {
  return cy.app('scenarios/' + name, options)
});

Cypress.Commands.add('appEval', function (code) {
  return cy.app('eval', code)
});

Cypress.Commands.add('appFactories', function (options) {
  return cy.app('factory_bot', options)
});

Cypress.Commands.add('appFixtures', function (options) {
  cy.app('activerecord_fixtures', options)
});
// CypressOnRails: end

// The next is optional
// beforeEach(() => {
//  cy.app('clean') // have a look at cypress/app_commands/clean.rb
// });

// comment this out if you do not want to attempt to log additional info on test fail
Cypress.on('fail', (err, runnable) => {
  // What the page looked like at the moment of failure, gathered before anything can
  // tear it down. A "never found element" timeout otherwise reaches the Rails log as
  // nothing at all -- the server finished its work long before, so log_fail's capture
  // shows a clean run of 200s and a thirty-second silence. See support/e2e.js.
  let diagnostics;
  try {
    diagnostics = pageDiagnostics();
  } catch (e) {
    diagnostics = { diagnosticError: String(e) };
  }

  // allow app to generate additional logging data
  Cypress.$.ajax({
    url: '/__e2e__/command',
    data: JSON.stringify({name: 'log_fail', options: {error_message: err.message, runnable_full_title: runnable.fullTitle(), diagnostics: diagnostics }}),
    async: false,
    method: 'POST'
  });

  throw err;
});
