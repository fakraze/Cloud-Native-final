describe('Environment Configuration Checker', () => {
  it('should correctly use the production environment settings', () => {
    // Check if we're using the right environment
    cy.log(`Environment: ${Cypress.env('environment')}`);
    cy.log(`Base URL: ${Cypress.config('baseUrl')}`);
    cy.log(`URL Prefix: ${Cypress.env('urlPrefix')}`);
    
    // Visit the home page
    cy.visit('/');
    cy.url().then(url => {
      cy.log(`Home URL: ${url}`);
    });
    
    // Visit a restaurant page (with correct URL prefix)
    const restaurantId = 1;
    const restaurantPath = `${Cypress.env('urlPrefix')}/restaurant/${restaurantId}`;
    cy.log(`Restaurant path: ${restaurantPath}`);
    
    cy.visit(restaurantPath);
    cy.url().then(url => {
      cy.log(`Restaurant URL: ${url}`);
      
      // In production mode, we should NOT see /dev/frontend in the URL
      if (Cypress.env('environment') === 'Production') {
        expect(url).to.include(`/restaurant/${restaurantId}`);
        expect(url).not.to.include('/dev/frontend');
      }
    });
  });
});
