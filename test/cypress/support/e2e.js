// Cypress support file
// This file is processed and loaded automatically before your test files.

// Log environment information at the start of each test
before(() => {
  cy.log(`Environment: ${Cypress.env('environment')}`);
  cy.log(`Base URL: ${Cypress.config('baseUrl')}`);
  cy.log(`URL Prefix: ${Cypress.env('urlPrefix')}`);
});

// Custom commands can be added here
// Example: cy.login(), cy.addToCart(), etc.
