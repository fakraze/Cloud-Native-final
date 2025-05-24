describe('TC-E01: 員工瀏覽菜單並下單（含客製化與立即結帳）', () => {
  it('should allow employee to order customized meal and automatically checkout', () => {
    
    // === Arrange ===
    cy.visit('/login')
    cy.get('input[name="username"]').type('employee1')
    cy.get('input[name="password"]').type('test123')
    cy.get('button[type="submit"]').click()

    // === Act ===
    // 員工登入成功後，應自動進入餐廳列表
    cy.url().should('include', '/restaurant')

    // 選擇餐廳「姊妹飯桶」
    cy.contains('.restaurant-card', '姊妹飯桶').click()
    cy.url().should('include', '/restaurant/姊妹飯桶/menu')

    // 點選菜單中的「雞腿便當」
    cy.contains('.menu-card', '雞腿便當').click()
    cy.url().should('include', '/restaurant/姊妹飯桶/menu/雞腿便當')

    // 客製化：加飯 + 外帶 + 加辣備註
    cy.get('input[name="rice"][value="加飯"]').check()
    cy.get('input[name="dine"][value="外帶"]').check()
    cy.get('input[name="note"]').type('加辣')
    cy.get('button').contains('加入').click()

    // 回到餐廳列表頁
    cy.url().should('include', '/restaurant')

    // 點右上角購物車圖示
    cy.get('#cart-button').click()
    cy.url().should('include', '/cart')

    // 在購物車中點擊「賒帳」
    cy.get('button').contains('賒帳').click()

    // === Assert ===
    // 訂單建立成功並顯示訂單資訊
    cy.contains('訂單編號').should('exist')
    cy.contains('雞腿便當').should('exist')
    cy.contains('加飯').should('exist')
    cy.contains('外帶').should('exist')
    cy.contains('加辣').should('exist')

  })
})
