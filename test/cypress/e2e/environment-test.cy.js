describe('Environment Configuration Test', () => {
  it('should load correct environment configuration', () => {
    const environment = Cypress.env('environment');
    const urlPrefix = Cypress.env('urlPrefix');
    const cartSelector = Cypress.env('cartSelector');
    
    cy.log(`Environment: ${environment}`);
    cy.log(`URL Prefix: ${urlPrefix}`);
    cy.log(`Cart Selector: ${cartSelector}`);
    
    // Visit the base URL to verify it works
    cy.visit('/');
    
    // Should reach some kind of page (login, home, etc.)
    cy.get('body').should('exist');
    
    expect(environment).to.exist;
    expect(['Development', 'Production']).to.include(environment);
  });
});
