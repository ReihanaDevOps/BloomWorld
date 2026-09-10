
---

# 🌸 BloomWorld – Cloud-Native DevSecOps Project

## 📌 Project Overview

BloomWorld is a cloud-native flower shop application designed to demonstrate  DevOps practices.

The project allows users to browse nearby flower shops and manage shop information. The application is deployed on **Google Kubernetes Engine (GKE)** using Kubernetes, Infrastructure as Code, CI/CD, GitOps, security scanning, and monitoring tools.

---

# 🏗️ Architecture Overview

The BloomWorld infrastructure follows a cloud-native architecture deployed on Google Cloud Platform.

<img width="341" height="851" alt="flow" src="https://github.com/user-attachments/assets/482159a8-df00-41a7-ad91-8f24494c3834" />


Monitoring architecture:

<img width="171" height="301" alt="monitoring" src="https://github.com/user-attachments/assets/ccf713f0-8725-4ff3-b977-ce9fba2bad50" />


---

# 🛠️ Technology Stack

| Category                | Technology                     |
| ----------------------- | ------------------------------ |
| Cloud Provider          | Google Cloud Platform          |
| Infrastructure as Code  | Terraform                      |
| Containerization        | Docker                         |
| Container Registry      | Google Artifact Registry       |
| Container Orchestration | Google Kubernetes Engine (GKE) |
| CI/CD                   | GitHub Actions                 |
| GitOps                  | Argo CD                        |
| Security Scanning       | Trivy                          |
| Monitoring              | Prometheus                     |
| Visualization           | Grafana                        |
| Autoscaling             | Kubernetes HPA                 |
| Traffic Management      | Kubernetes Gateway API         |
| Backend                 | Node.js                        |
| Frontend                | React + TypeScript             |
| Version Control         | GitHub                         |

---
```text
# 📁 Project Structure

BloomWorld/
│
├── frontend/
│   └── React application
│
├── shop-service/
│   ├── server.js
│   ├── Dockerfile
│   └── package.json
│
├── kubernets/
│   ├── namespace.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── serviceaccount.yaml
│   ├── gateway.yaml
│   ├── httproute.yaml
│   ├── hpa.yaml
│   └── rbac.yaml
│
├── terraform/
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
│
├── .github/
│   └── workflows/
│       └── deploy.yaml
│
├── bloomworld-argocd.yaml
│
└── README.md
```
---

# ☁️ Infrastructure Provisioning

Infrastructure is provisioned using **Terraform**.

The infrastructure includes:

* GKE Kubernetes cluster
* Networking components
* VPC
* Subnets
* Kubernetes node pools
* Artifact Registry
* Cloud Storage for frontend hosting
* Load Balancer configuration

Terraform provides Infrastructure as Code (IaC), allowing infrastructure resources to be provisioned and managed consistently.

Example:

```bash
terraform init
```

```bash
terraform plan
```

```bash
terraform apply
```

---

# ☸️ Kubernetes Deployment

The BloomWorld backend is deployed to **Google Kubernetes Engine (GKE)**.

The Kubernetes configuration includes:

### Namespace

A dedicated namespace is used:

```text
bloomworld
```

### Deployment

The backend application runs as a Kubernetes Deployment.

This provides:

* Pod management
* Application availability
* Rolling updates
* Container orchestration

### Service

A Kubernetes Service exposes the backend application internally.

### Gateway and HTTPRoute

The Kubernetes Gateway API is used for traffic management.

```text
Client
   │
   ▼
Gateway
   │
   ▼
HTTPRoute
   │
   ▼
Shop Service
   │
   ▼
Application Pods
```

---

# 📈 Horizontal Pod Autoscaling

Horizontal Pod Autoscaler (HPA) is configured for the backend service.

HPA automatically scales application pods based on resource utilization.

Example:

```text
Low Traffic
    │
    ▼
Few Pods

High Traffic
    │
    ▼
More Pods Automatically
```

This improves scalability and resource utilization.

---

# 🔐 Security Implementation

The project implements several DevSecOps security practices.

## RBAC

Kubernetes Role-Based Access Control (RBAC) is configured.

This controls which Kubernetes resources a service account can access.

The implementation includes:

* Role
* Role permissions
* RoleBinding
* Service Account

Example flow:

```text
Service Account
      │
      ▼
RoleBinding
      │
      ▼
Kubernetes Role
      │
      ▼
Allowed Resources
```

---

# 🔍 Container Security Scanning

Trivy is integrated into the CI/CD workflow to scan Docker container images.

The scan checks for vulnerabilities, including:

* HIGH severity vulnerabilities
* CRITICAL severity vulnerabilities

Pipeline flow:

```text
Docker Image
      │
      ▼
Trivy Scan
      │
      ▼
Security Results
      │
      ▼
Artifact Registry
```

This helps identify security vulnerabilities before deployment.

---

# 🔄 CI/CD Pipeline

GitHub Actions is used to automate the application build and deployment process.

The pipeline performs the following steps:

```text
Git Push
   │
   ▼
GitHub Actions
   │
   ├── Checkout Code
   │
   ├── Authenticate with Google Cloud
   │
   ├── Login to Artifact Registry
   │
   ├── Build Docker Image
   │
   ├── Trivy Security Scan
   │
   ├── Push Image to Artifact Registry
   │
   ├── Get GKE Credentials
   │
   └── Apply Kubernetes Manifests
```

Google Cloud authentication is performed using **Workload Identity Federation**, avoiding the need to store long-lived GCP service account keys in GitHub.

---

# 📦 Artifact Registry

Docker images are stored in **Google Artifact Registry**.

Example image structure:

```text
asia-south1-docker.pkg.dev/
    PROJECT_ID/
        REPOSITORY/
            shop-service
```

Images are tagged using:

```text
Git Commit SHA
```

and:

```text
latest
```

Using commit SHA tags improves image traceability.

---

# 🔁 GitOps with Argo CD

Argo CD is deployed inside the Kubernetes cluster to manage application synchronization from the GitHub repository.

The Argo CD application is configured with:

* GitHub repository
* Kubernetes manifests directory
* Target namespace
* Automated synchronization
* Self-healing
* Pruning

GitOps workflow:

```text
GitHub Repository
        │
        ▼
      Argo CD
        │
        ▼
Compare Git State
with Cluster State
        │
        ▼
Synchronize Kubernetes Resources
```

### Self-Healing

If the cluster configuration changes manually and differs from the desired configuration stored in Git, Argo CD can restore the desired state.

### Pruning

Resources removed from the Git repository can also be removed from the Kubernetes cluster.

---

# 📊 Monitoring

The project uses the **kube-prometheus-stack**, which includes:

* Prometheus
* Grafana
* Alertmanager
* Node Exporter
* kube-state-metrics

Monitoring architecture:

```text
Kubernetes Cluster
       │
       ▼
   Prometheus
       │
       ▼
    Grafana
       │
       ▼
 Monitoring
 Dashboards
```

The Grafana dashboards provide visibility into:

* CPU utilization
* Memory utilization
* Kubernetes namespaces
* Pods
* Nodes
* Resource requests
* Resource limits
* Cluster resource usage

Example dashboards include:

```text
Kubernetes / Compute Resources / Cluster
```

---

# 🛠️ Troubleshooting

Grafana and Prometheus can be used to investigate Kubernetes resource issues.

Example troubleshooting areas include:

### High CPU Usage

```text
Grafana
   │
   ▼
CPU Utilization Dashboard
   │
   ▼
Identify Namespace / Pod
   │
   ▼
Investigate Application
```

### High Memory Usage

```text
Grafana
   │
   ▼
Memory Metrics
   │
   ▼
Identify Resource Usage
   │
   ▼
Troubleshoot Pod
```

Useful Kubernetes commands:

```bash
kubectl get pods -n bloomworld
```

```bash
kubectl describe pod <pod-name> -n bloomworld
```

```bash
kubectl logs <pod-name> -n bloomworld
```

```bash
kubectl get deployment -n bloomworld
```

```bash
kubectl get svc -n bloomworld
```

---

# 🚀 Application Deployment

To deploy the Kubernetes resources manually:

```bash
kubectl apply -f kubernets/namespace.yaml
```

```bash
kubectl apply -f kubernets/serviceaccount.yaml
```

```bash
kubectl apply -f kubernets/service.yaml
```

```bash
kubectl apply -f kubernets/gateway.yaml
```

```bash
kubectl apply -f kubernets/httproute.yaml
```

```bash
kubectl apply -f kubernets/hpa.yaml
```

The application deployment can then be verified using:

```bash
kubectl get pods -n bloomworld
```

---

# 📊 Monitoring Access

Prometheus and Grafana are deployed inside the Kubernetes cluster.

Grafana provides a web-based dashboard for monitoring Kubernetes resources.

Important monitoring areas include:

* Cluster CPU usage
* Cluster memory usage
* Namespace resource usage
* Pod resource usage
* Kubernetes workloads

---

# 🎯 DevSecOps Practices Demonstrated

This project demonstrates the following practices:

### DevOps

* Infrastructure as Code
* CI/CD automation
* Containerization
* Kubernetes orchestration
* Autoscaling
* Monitoring
* GitOps

### DevSecOps

* RBAC
* Workload Identity Federation
* Container vulnerability scanning
* Artifact Registry
* Secure cloud authentication
* Kubernetes access control

---

# 🧩 Challenges and Troubleshooting

During the project implementation, several issues were identified and resolved.

Examples include:

### Frontend Caching

A frontend deployment update was initially affected by caching. The issue was verified by testing from different devices and browser sessions.

### Argo CD Synchronization

Argo CD synchronization initially failed because a `ServiceMonitor` resource required the Prometheus Operator CRD.

The issue was resolved by ensuring the required monitoring components were installed or by adjusting the deployment configuration.

### Kubernetes API Connectivity

Backend connectivity and routing were verified using Kubernetes Services, Gateway, and HTTPRoute configuration.

---

# 📸 Screenshots

The following screenshots should be included in the project documentation or repository:

* GKE Cluster
* Terraform deployment
* GitHub Actions pipeline
* Trivy security scan
* Artifact Registry Docker image
* Argo CD application
* Grafana monitoring dashboard
* BloomWorld frontend application
* Kubernetes pods and services

---

# 🔮 Future Improvements

Possible future improvements include:

* Centralized application logging
* SonarQube integration for code quality analysis
* Automated security policy enforcement
* Alert notifications
* Database integration
* Persistent storage
* HTTPS/TLS configuration
* Production-grade secret management integration
* Advanced Kubernetes network policies

---

# 👩‍💻 Author

**Pathima Reihana**

DevOps / DevSecOps Engineer

---

# 📄 Conclusion

BloomWorld demonstrates a practical implementation of a **cloud-native DevSecOps architecture** using Google Cloud Platform and Kubernetes.

The project combines:

* Terraform infrastructure provisioning
* Docker containerization
* Google Artifact Registry
* GitHub Actions CI/CD
* Trivy security scanning
* Kubernetes deployment
* RBAC
* Horizontal Pod Autoscaling
* Gateway API
* Argo CD GitOps
* Prometheus monitoring
* Grafana visualization

This project demonstrates the complete lifecycle from **application source code to secure, automated cloud deployment and monitoring**.

---

### ⚠️ One important thing before you submit

In the README, **only claim features you actually implemented**.

From our work, I would especially verify these assignment requirements before finalizing:

* Google Secret Manager integration
* Small database
* Persistent/managed storage
* Application logging

If you want, I can next give you a **final polished README.md specifically matching your exact assignment requirements**, so you can directly copy it into GitHub.
