describe('TC-E04: 員工歷史訂單篩選測試（預設一月 → 篩選一週）', () => {
  it('should load 1 month history by default and update to 1 week when filtered', () => {

    // Arrange: 攔截一個月資料
    cy.intercept('GET', '/api/order/history?range=1month', {
      statusCode: 200,
      body: [
        { orderId: 'old001', date: '2024-05-01', items: [{ name: '雞腿便當', price: 120 }], total: 120 },
        { orderId: 'old002', date: '2024-05-15', items: [{ name: '排骨便當', price: 130 }], total: 130 }
      ]
    }).as('getMonthData')

    // Arrange: 攔截一週資料
    cy.intercept('GET', '/api/order/history?range=1week', {
      statusCode: 200,
      body: [
        { orderId: 'recent001', date: '2024-05-20', items: [{ name: '蔬菜便當', price: 100 }], total: 100 }
      ]
    }).as('getWeekData')

    // Act: 登入 → 前往歷史訂單
    cy.visit('/login')
    cy.get('input[name="username"]').type('employee1')
    cy.get('input[name="password"]').type('test123')
    cy.get('button[type="submit"]').click()
    cy.get('#personal-button').click()
    cy.get('[data-tab="購物紀錄"]').click()
    cy.contains('歷史訂單').click()

    // 預設加載「過去 1 個月」資料
    cy.wait('@getMonthData')
    cy.contains('過去一個月').should('be.visible')
    cy.get('.history-order-card').should('have.length', 2)

    // 切換為「過去 1 週」
    cy.get('select[name="dateRange"]').select('過去一週')
    cy.wait('@getWeekData')
    cy.contains('過去一週').should('be.visible')

    // Assert: 畫面應只剩一筆資料，顯示「蔬菜便當」
    cy.get('.history-order-card').should('have.length', 1)
    cy.get('.history-order-card').first().within(() => {
      cy.contains('蔬菜便當').should('exist')
      cy.contains('雞腿便當').should('not.exist')
    })
  })
})
