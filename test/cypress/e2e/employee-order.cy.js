describe('TC-E01: 員工瀏覽菜單並下單（含客製化與立即結帳）', () => {
  it('should allow employee to order customized meal and automatically checkout', () => {
    // Step 1: 員工登入 → 自動進入 /restaurant
    cy.visit('/login')
    cy.get('input[name="username"]').type('employee1')
    cy.get('input[name="password"]').type('test123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/restaurant')

    // Step 2: 選擇餐廳「姊妹飯桶」
    cy.contains('.restaurant-card', '姊妹飯桶').click()
    cy.url().should('include', '/restaurant/姊妹飯桶/menu')

    // Step 3: 選擇菜色「雞腿便當」
    cy.contains('.menu-card', '雞腿便當').click()
    cy.url().should('include', '/menu/雞腿便當')

    // Step 4: 客製化選項
    cy.get('input[name="rice"][value="加飯"]').check()
    cy.get('input[name="dine"][value="外帶"]').check()
    cy.get('input[name="note"]').type('加辣')
    cy.get('button').contains('加入').click()

    // Step 5: 回到餐廳列表頁
    cy.url().should('include', '/restaurant')

    // Step 6: 點選購物車
    cy.get('#cart-button').click()
    cy.url().should('include', '/cart')

    // Step 7: 賒帳送出（即建立訂單並結帳）
    cy.get('button').contains('賒帳').click()

    // Step 8: 驗證訂單建立成功 + 結帳成功
    cy.contains('訂單建立成功').should('be.visible')
    cy.contains('訂單編號').should('exist')
    cy.contains('付款成功').should('be.visible')  // 如果有這類訊息
  })
})
