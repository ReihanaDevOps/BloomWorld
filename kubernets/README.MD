Yes 👍 For your assignment, let's keep it simple with **only 4 Kubernetes YAML files**:

```text
kubernetes/
├── deployment.yaml
├── service.yaml
├── hpa.yaml
└── gateway.yaml
```

These four cover the important requirements.

---

## 1. `deployment.yaml`

This deploys your backend application with:

* 2 replicas
* Rolling updates
* Resource requests and limits
* Readiness probe
* Liveness probe

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: default

spec:
  replicas: 2

  selector:
    matchLabels:
      app: backend

  strategy:
    type: RollingUpdate

    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1

  template:
    metadata:
      labels:
        app: backend

    spec:
      containers:
        - name: backend

          image: asia-south1-docker.pkg.dev/PROJECT_ID/REPOSITORY/backend:latest

          ports:
            - containerPort: 3000

          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"

            limits:
              cpu: "500m"
              memory: "512Mi"

          readinessProbe:
            httpGet:
              path: /health
              port: 3000

            initialDelaySeconds: 5
            periodSeconds: 10

          livenessProbe:
            httpGet:
              path: /health
              port: 3000

            initialDelaySeconds: 15
            periodSeconds: 20
```

📌 Replace:

```text
PROJECT_ID
REPOSITORY
```

with your actual GCP values.

---

# 2. `service.yaml`

This connects the Gateway to your backend Pods.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service

spec:
  selector:
    app: backend

  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000

  type: ClusterIP
```

Flow:

```text
Gateway
   ↓
Service
   ↓
Backend Pods
```

---

# 3. `hpa.yaml`

This automatically scales your backend Pods.

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa

spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend

  minReplicas: 2
  maxReplicas: 5

  metrics:
    - type: Resource

      resource:
        name: cpu

        target:
          type: Utilization
          averageUtilization: 70
```

Example:

```text
CPU < 70%
   ↓
2 Pods


CPU > 70%
   ↓
Scale up
   ↓
Up to 5 Pods
```

---

# 4. `gateway.yaml`

This file includes **both the Gateway and the HTTPRoute**, so you don't need a separate `httproute.yaml`.

```yaml
# =====================================================
# GATEWAY
# =====================================================

apiVersion: gateway.networking.k8s.io/v1
kind: Gateway

metadata:
  name: bloomworld-gateway

spec:
  gatewayClassName: gke-l7-global-external-managed

  listeners:
    - name: http

      protocol: HTTP

      port: 80

      allowedRoutes:
        namespaces:
          from: Same

---

# =====================================================
# HTTP ROUTE
# =====================================================

apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute

metadata:
  name: backend-route

spec:
  parentRefs:
    - name: bloomworld-gateway

  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /api

      backendRefs:
        - name: backend-service
          port: 80
```

---

# Final structure

```text
kubernetes/
│
├── deployment.yaml   # Backend Pods
├── service.yaml      # Internal networking
├── hpa.yaml          # Autoscaling
└── gateway.yaml      # Gateway + HTTPRoute
```

### Complete traffic flow

```text
Internet
    ↓
External Load Balancer
    ↓
GKE Gateway
    ↓
HTTPRoute
    ↓
backend-service
    ↓
┌─────────────┐
│ Backend Pod │
├─────────────┤
│ Backend Pod │
└─────────────┘
       ↑
       │
      HPA
```

This 4-file setup is a good, clean structure for your current assignment.
