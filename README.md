# Cloud-Native-final
Meal Provider




# End-to-End Testing with Cypress

本專案使用 [Cypress](https://www.cypress.io/) 作為 End-to-End (E2E) 測試框架，所有測試檔案與設定均集中在 `test/` 資料夾中，方便團隊開發與維護。

---

## Dir
```
├── test/  
│   | cypress/  
│     | e2e/  
│       ├── employee-order.cy.js    # 員工點餐流程測試案例  
│   ├──  package.json             # Cypress 相依與指令  
│   ├── cypress.config.js        # 測試設定檔  
```

---

## Run Cypress Testing

```bash
cd test
npm install
```
Test with Cypress GUI

```bash
npm run cy:open
```

Test in Terminal
```bash
npm run test
```