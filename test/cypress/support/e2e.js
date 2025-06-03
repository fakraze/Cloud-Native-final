// Cypress support file
// This file is processed and loaded automatically before your test files.

// Import environment configuration
const { config } = require('./environments');

// Make environment config available globally
Cypress.on('test:before:run', () => {
  console.log(`Testing on: ${config.name} environment (${config.baseUrl})`);
});

// Custom commands can be added here
// Example: cy.login(), cy.addToCart(), etc.
