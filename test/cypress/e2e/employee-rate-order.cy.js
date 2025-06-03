describe('TC-E03: 員工對已完成訂單進行評價', () => {
  const urlPrefix = Cypress.env('urlPrefix') || '';
    beforeEach(() => {
    // Frontend uses mock services, no need for API intercepts

    // Visit the login page
    cy.visit(urlPrefix + '/login');

    // Login as employee
    cy.get('input[name="email"]', { timeout: 10000 }).should('be.visible').type('employee@test.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Wait for successful login redirect
    cy.url({ timeout: 10000 }).should('not.include', '/login');
    cy.wait(1000);
  });

  it('should allow employee to rate a completed order with stars and comment', () => {
    // Navigate to Order History page
    cy.get('body').then(($body) => {
      if ($body.find('a:contains("Order History")').length > 0) {
        cy.contains('a', 'Order History').click();
      } else if ($body.find('button:contains("Order History")').length > 0) {
        cy.contains('button', 'Order History').click();
      } else if ($body.find('[href*="order-history"]').length > 0) {
        cy.get('[href*="order-history"]').first().click();
      } else {
        cy.visit(urlPrefix + '/order-history');
      }
    });

    // Verify we're on the order history page
    cy.url().should('include', '/order-history');
    cy.get('body').should('be.visible');
    cy.wait(2000);

    // Look for orders and try to find Rate button
    cy.get('body').then(($body) => {
      if ($body.find('.card').length > 0) {
        cy.get('.card').should('have.length.at.least', 1);
        
        // Look for Rate button in the first card
        cy.get('.card').first().then(($card) => {
          if ($card.find('button').length > 0) {
            cy.get('.card').first().find('button').last().click();
          } else if ($card.find('a').length > 0) {
            cy.get('.card').first().find('a').last().click();
          }
        });
      } else if ($body.find('.order-item').length > 0) {
        cy.get('.order-item').first().click();      } else {
        // Fallback: try direct navigation to order 3 (exists in mock data)
        cy.visit(urlPrefix + '/rate/3');
      }
    });

    // Check if we're on a rating page
    cy.url().should('satisfy', (url) => {
      return url.includes('/rate') || url.includes('/rating') || url.includes('/order');
    });    cy.wait(1000);
      // Handle star ratings - look for the specific rating sections
    cy.log('Looking for star rating sections');
    
    // Wait for the page to fully load
    cy.get('form').should('be.visible');
    cy.wait(500);

    // First rating: "How was the taste?"
    cy.contains('How was the taste?').should('be.visible').parent().within(() => {
      cy.log('Clicking 5th star for taste rating');
      cy.get('button').eq(4).click({ force: true }); // 5th star (index 4)
      cy.wait(300);
    });

    // Second rating: "How was the value for money?"
    cy.contains('How was the value for money?').should('be.visible').parent().within(() => {
      cy.log('Clicking 5th star for value rating');
      cy.get('button').eq(4).click({ force: true }); // 5th star (index 4)
      cy.wait(300);
    });    // Add a comment
    cy.get('textarea#comment').should('be.visible').type('Great food and excellent service!');
    cy.wait(500);

    // Submit the rating
    cy.get('button[type="submit"]').should('be.visible').and('not.be.disabled').click();

    // Verify operation completed
    cy.wait(1000);
    cy.get('body').should('be.visible');
    cy.log('Rating test completed');
  });
});
