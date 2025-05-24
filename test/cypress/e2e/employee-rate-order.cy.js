describe('TC-E03: 員工對已完成訂單進行評價', () => {
  it('should allow employee to rate a completed order with stars and comment', () => {

    // === Arrange ===
    // 1. 攔截歷史訂單 API
    cy.intercept('GET', '/api/order/history', {
      statusCode: 200,
      body: [
        {
          orderId: 'test123',
          restaurantId: '姊妹飯桶',
          item: '雞腿便當',
          status: '已完成',
          commentable: true,
          rating: null,
          note: '加辣'
        }
      ]
    }).as('getOrderHistory')

    // 2. 攔截該訂單詳細內容（/rate 頁面使用）
    cy.intercept('GET', '/api/order/test123', {
      statusCode: 200,
      body: {
        orderId: 'test123',
        restaurantId: '姊妹飯桶',
        items: [
          { dishId: '雞腿便當', name: '雞腿便當', quantity: 1 }
        ],
        status: '已完成',
        note: '加辣'
      }
    }).as('getOrderDetail')

    // 3. 攔截送出評價 API
    cy.intercept('POST', '/api/rating', (req) => {
      expect(req.body).to.have.property('orderId', 'test123')
      expect(req.body).to.have.property('restaurantRating')
      expect(req.body.restaurantRating).to.have.property('taste')
      expect(req.body.dishes).to.be.an('array')
      req.reply({ success: true, message: '評價成功' })
    }).as('postRating')

    // === Act ===
    // 4. 登入
    cy.visit('/login')
    cy.get('input[name="username"]').type('employee1')
    cy.get('input[name="password"]').type('test123')
    cy.get('button[type="submit"]').click()

    // 5. 前往個人頁 → 點「購物紀錄」Tab → 等待歷史訂單
    cy.get('#personal-button').click()
    cy.url().should('include', '/personal')
    cy.get('[data-tab="購物紀錄"]').click()
    cy.wait('@getOrderHistory')

    // 6. 點擊「評價」按鈕（這會觸發前端設 sessionStorage 並跳轉）
    cy.get('.order-card').first().within(() => {
      cy.contains('評價').click()
    })

    // 7. 驗證跳轉至 /rate/:restaurantId
    cy.url().should('include', '/rate/姊妹飯桶')
    cy.wait('@getOrderDetail')

    // === 評價操作 ===
    // 對餐廳評味道與 CP 值（依你設計的欄位）
    cy.get('[data-rating="taste"][value="4"]').check()
    cy.get('[data-rating="cp"][value="3"]').check()
    cy.get('textarea[name="comment"]').type('份量剛好，味道不錯')

    // 對雞腿便當評 4 星（假設有星級 UI）
    cy.get('[data-dish-id="雞腿便當"] [data-star="4"]').click()

    // 點送出
    cy.get('button').contains('送出').click()

    // === Assert ===
    cy.wait('@postRating')
    cy.get('.order-card').first().within(() => {
      cy.contains('已評價').should('exist')
    })
    cy.url().should('include', '/personal')

    // 評價內容
    cy.get('.order-card').first().within(() => {
      cy.contains('查看評價').click()
    })
    cy.url().should('include', '/restaurant/姊妹飯桶/rate')    
    cy.get('#rating-table tbody tr').first().within(() => {
      cy.get('[data-label="味道"]').should('contain', '4')
      cy.get('[data-label="CP 值"]').should('contain', '3')
      cy.get('[data-label="評論"]').should('contain', '份量剛好，味道不錯')
    })
    
  })
})
