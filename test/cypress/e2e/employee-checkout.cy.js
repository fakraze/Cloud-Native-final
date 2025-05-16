describe('TC-E02: 員工下單後確認訂單明細（於 /personal）', () => {
  it('should show the current order in personal page after placing order', () => {
    // Step 1: 員工登入
    cy.visit('/login')
    cy.get('input[name="username"]').type('employee1')
    cy.get('input[name="password"]').type('test123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/restaurant')

    // Step 2: 點選餐廳與菜單
    cy.contains('.restaurant-card', '姊妹飯桶').click()
    cy.contains('.menu-card', '雞腿便當').click()
    cy.get('input[name="rice"][value="加飯"]').check()
    cy.get('input[name="dine"][value="外帶"]').check()
    cy.get('input[name="note"]').type('加辣')
    cy.get('button').contains('加入').click()

    // Step 3: 點選購物車並送出（賒帳）
    cy.get('#cart-button').click()
    cy.get('button').contains('賒帳').click()
    cy.contains('訂單建立成功').should('be.visible')

    // Step 4: 回到 /personal
    cy.visit('/personal')
    cy.url().should('include', '/personal')

    // Step 5: 驗證「進行中訂單」內容正確
    cy.get('.order-card').first().within(() => {
      cy.contains('雞腿便當')
      cy.contains('加飯')
      cy.contains('外帶')
      cy.contains('加辣')
      cy.contains(/進行中|已送出/) // 依實際狀態文字
    })
  })
})
