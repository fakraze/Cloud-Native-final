describe('TC-E02: 員工訂單確認', () => {
  it('should display order detail with status in /personal after placing an order', () => {

    // === Arrange ===
    cy.visit('/login')
    cy.get('input[name="email"]').clear().type('employee@test.com');
    cy.get('input[name="password"]').clear().type('password123');

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Wait for redirection after login
    cy.url().should('include', '/restaurant');

    // === Act ===
    // Select restaurant "Pizza Palace" from the list
    cy.contains('.card', 'Pizza Palace').click();
    
    // We should now be on the menu page
    cy.url().should('include', '/restaurant');

    // Select "Margherita Pizza" from the menu
    cy.contains('.card, .menu-item-card', 'Margherita Pizza').click();
    
    // We should now be on the item detail page
    cy.url().should('include', '/menu');

    // Customize the order
    // Select pickup option
    cy.get('input[type="radio"][value="pickup"]').check({ force: true });

    // Add special instructions
    cy.get('textarea').type('加辣', { force: true });

    // Set quantity if needed
    // Using the + button to increase quantity if available
    cy.get('button').contains('+').click({ force: true });

    // Add to cart
    cy.get('button').contains('Add to Cart').click();

    // Go to cart
    cy.get('[data-testid="cart-button"], #cart-button, a[href*="/cart"]').click();
    
    // Check we're on the cart page
    cy.url().should('include', '/cart');

    // Complete the order
    cy.get('button').contains(/Checkout|Place Order|賒帳/).click();
    
    // Verify success message
    cy.contains(/Order successful|訂單建立成功/).should('be.visible');

    // Go to personal page
    cy.get('[data-testid="personal-button"], #personal-button, a[href*="/personal"]').click();
    
    // Check we're on the personal page
    cy.url().should('include', '/personal');
        
    // View orders
    cy.contains(/Orders|訂單/).click();
    
    // Check we're on the orders page
    cy.url().should('include', '/order');

    // Select the first order
    cy.get('.order-card, .card').first().click();

    // === Assert ===
    // Check order details
    cy.contains(/Order ID|訂單編號/).should('exist');
    cy.contains(/Margherita Pizza/).should('exist');
    cy.contains(/加辣/).should('exist');
    cy.contains(/Status|狀態/).should('exist');
    cy.contains(/Pending|Processing|Completed|確認中|製作中|已送出/).should('exist');
  })
})
