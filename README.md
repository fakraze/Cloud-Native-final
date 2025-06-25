# Cloud-Native-final

##  Meal Provider


# Website
http://13.218.27.133/  
http://13.218.27.133/dev/frontend/

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
