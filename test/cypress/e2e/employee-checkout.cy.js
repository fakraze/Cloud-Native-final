describe('TC-E02: 員工訂單確認', () => {
  it('should display order detail with status in /personal after placing an order', () => {

    // === Arrange ===
    cy.visit('/login')
    cy.get('input[name="username"]').type('employee1')
    cy.get('input[name="password"]').type('test123')
    cy.get('button[type="submit"]').click()

    // === Act ===
    // 登入後進入餐廳列表
    cy.url().should('include', '/restaurant')

    // 選擇餐廳「姊妹飯桶」
    cy.contains('.restaurant-card', '姊妹飯桶').click()
    cy.url().should('include', '/restaurant/姊妹飯桶/menu')

    // 點餐「雞腿便當」
    cy.contains('.menu-card', '雞腿便當').click()
    cy.url().should('include', '/restaurant/姊妹飯桶/menu/雞腿便當')


    // 客製化
    cy.get('input[name="rice"][value="加飯"]').check()
    cy.get('input[name="dine"][value="外帶"]').check()
    cy.get('input[name="note"]').type('加辣')
    cy.get('button').contains('加入').click()

    // 回餐廳頁
    cy.url().should('include', '/restaurant')

    // 前往購物車
    cy.get('#cart-button').click()
    cy.url().should('include', '/cart')

    // 點擊「賒帳」送出訂單
    cy.get('button').contains('賒帳').click()
    cy.contains('訂單建立成功').should('be.visible')

    // 轉跳個人頁面
    cy.get('#personal-button').click()
    cy.url().should('include', '/personal')
        
    // 點選「進行中訂單」Tab
    cy.get('[data-tab="進行中訂單"]').click()
    cy.url().should('include', '/order')

    // 點第一筆訂單
    cy.get('.order-card').first().click()
    cy.url().should('include', '/order_detail')

    // === Assert ===
    // 檢查進行中訂單是否正確顯示
    cy.contains('訂單編號').should('exist')
    cy.contains('雞腿便當').should('exist')
    cy.contains('加飯').should('exist')
    cy.contains('外帶').should('exist')
    cy.contains('加辣').should('exist')
    cy.contains(/確認中|製作中|已送出/).should('exist')
  })
})
