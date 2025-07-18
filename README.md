# Cloud-Native-final

##  Meal Provider


# Website
http://13.218.27.133/  
http://13.218.27.133/dev/frontend/

---

## Dir
```
├── test/  
│   | cypress/  
│     | e2e/  
│       ├── employee-order.cy.js  # 員工點餐流程測試案例  
│       ├── employee-order.cy.js  # 員工下單流程
│       ├── employee-checkout.cy.js  # 結帳測試
│       ├── employee-rate-order.cy.js  # 餐點評價流程
│       ├── employee-history.cy.js  # 歷史訂單查詢與篩選
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

## Run Cypress Tests for Different Environments

To run Cypress tests in different environments (`dev` or `prod`), you can use the following commands:

### GUI Mode

Run Cypress in GUI mode for the `dev` environment:
```bash
npm run cy:open -- --env CYPRESS_ENV=dev
```

Run Cypress in GUI mode for the `prod` environment:
```bash
npm run cy:open -- --env CYPRESS_ENV=prod
```

### Terminal Mode

Run Cypress tests in the terminal for the `dev` environment:
```bash
npm run test -- --env CYPRESS_ENV=dev
```

Run Cypress tests in the terminal for the `prod` environment:
```bash
npm run test -- --env CYPRESS_ENV=prod
```

## Run k8s on yor own

Install tools (run terminal use administrator)
```bash
choco install k3d
choco install kubernetes-cli
```

Open docker desktop
Create k3d server
```bash
k3d cluster create meal-test --port 8080:80@loadbalancer
k3d cluster list
```

Build doker image
```bash
docker build -t cloud-meal-frontend:local ./frontend
docker build -t cloud-meal-backend:local ./backend
```

Import docker image to k3d
```bash
k3d image import cloud-meal-frontend:local -c meal-test
k3d image import cloud-meal-backend:local -c meal-test
```

Deploy yaml
```bash
kubectl apply -f k8s/namespace-prod.yaml
kubectl apply -n cloudnative -f k8s/backend-deployment.yaml
kubectl apply -n cloudnative -f k8s/backend-service.yaml
kubectl apply -n cloudnative -f k8s/frontend-deployment.yaml
kubectl apply -n cloudnative -f k8s/frontend-service.yaml
kubectl apply -f k8s/ingress-prod.yaml
```

Check status
```bash
kubectl get pods -n cloudnative
kubectl get ingress -n cloudnative
```

Website
http://localhost:8080/

Clear 
```bash
kubectl delete all --all -n cloudnative
kubectl delete ingress ingress-prod -n cloudnative
```
