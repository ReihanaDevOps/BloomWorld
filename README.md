
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


# Prerequisites

Install the following tools:

* Terraform
* Google Cloud SDK
* kubectl
* Helm
* Git
* Docker

Login to Google Cloud:

```bash
gcloud auth login
```

Set the GCP project:

```bash
gcloud config set project YOUR_PROJECT_ID
```

---

# 1. Infrastructure Provisioning

Go to the Terraform directory:

```bash
cd terraform
```

Initialize Terraform:

```bash
terraform init
```

Review the infrastructure plan:

```bash
terraform plan
```

Provision the infrastructure:

```bash
terraform apply
```

Terraform provisions the following infrastructure:

* GKE Cluster
* VPC Networking
* Subnets
* Artifact Registry
* Cloud SQL PostgreSQL
* Google Secret Manager
* Cloud Storage Bucket
* Static Landing Page Infrastructure

---

# 2. Connect to GKE

After Terraform creates the Kubernetes cluster:

```bash
gcloud container clusters get-credentials bloomworld-gke \
  --region asia-south1 \
  --project YOUR_PROJECT_ID
```

Check the cluster:

```bash
kubectl get nodes
```

---

# 3. Kubernetes RBAC

The project includes a Kubernetes ServiceAccount and RBAC configuration.

Apply the RBAC configuration:

```bash
kubectl apply -f kubernets/serviceaccount.yaml
```

Check the Role:

```bash
kubectl get roles -n bloomworld
```

Check the ServiceAccount:

```bash
kubectl get serviceaccount -n bloomworld
```

RBAC is used to control what permissions Kubernetes workloads and users have inside the cluster.

---

# 4. Deploy Kubernetes Application

Apply the Kubernetes resources:

```bash
kubectl apply -f kubernets/namespace.yaml
kubectl apply -f kubernets/serviceaccount.yaml
kubectl apply -f kubernets/service.yaml
kubectl apply -f kubernets/deployment.yaml
kubectl apply -f kubernets/hpa.yaml
kubectl apply -f kubernets/gateway.yaml
kubectl apply -f kubernets/httproute.yaml
```

Check the deployment:

```bash
kubectl get deployments -n bloomworld
```

Check the pods:

```bash
kubectl get pods -n bloomworld
```

Check the services:

```bash
kubectl get services -n bloomworld
```

---

# 5. Install Argo CD

Create the Argo CD namespace:

```bash
kubectl create namespace argocd
```

Install Argo CD:

```bash
kubectl apply -n argocd \
  -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Wait for the pods:

```bash
kubectl get pods -n argocd
```

Expose Argo CD:

```bash
kubectl patch svc argocd-server \
  -n argocd \
  -p '{"spec": {"type": "LoadBalancer"}}'
```

Check the external IP:

```bash
kubectl get svc argocd-server -n argocd
```

Get the Argo CD username:

```text
Username: admin
```

Get the initial password:

```bash
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d
```

Apply the BloomWorld Argo CD application:

```bash
kubectl apply -f bloomworld-argocd.yaml
```

Check the application:

```bash
kubectl get applications -n argocd
```

---

# 6. Install Prometheus and Grafana

Add the Prometheus Helm repository:

```bash
helm repo add prometheus-community \
  https://prometheus-community.github.io/helm-charts
```

Update the repository:

```bash
helm repo update
```

Create the monitoring namespace:

```bash
kubectl create namespace monitoring
```

Install Prometheus and Grafana:

```bash
helm install monitoring \
  prometheus-community/kube-prometheus-stack \
  -n monitoring
```

Check the monitoring pods:

```bash
kubectl get pods -n monitoring
```

Get the Grafana password:

```bash
kubectl get secret monitoring-grafana \
  -n monitoring \
  -o jsonpath="{.data.admin-password}" | base64 -d
```

Grafana username:

```text
admin
```

Access Grafana using port forwarding:

```bash
kubectl port-forward \
  -n monitoring \
  svc/monitoring-grafana \
  3000:80
```

Open:

```text
http://localhost:3000
```

Prometheus collects Kubernetes and application metrics, while Grafana provides dashboards for visualization and troubleshooting.

---

# 7. Trivy Security Scanning

Trivy is integrated into the CI/CD pipeline to scan the Docker image for vulnerabilities.

The general scan command is:

```bash
trivy image IMAGE_NAME
```

Example:

```bash
trivy image asia-south1-docker.pkg.dev/PROJECT_ID/REPOSITORY/shop-service:latest
```

The CI/CD pipeline performs the following flow:

```text
Build Image
    ↓
Trivy Security Scan
    ↓
Push Image to Artifact Registry
    ↓
Deploy to Kubernetes
```

---

# 8. CI/CD Pipeline

GitHub Actions is used for Continuous Integration and Deployment.

The pipeline performs:

1. Checkout source code
2. Authenticate with Google Cloud
3. Build the Docker image
4. Scan the image using Trivy
5. Push the image to Google Artifact Registry
6. Deploy Kubernetes resources

The workflow is automatically triggered when changes are pushed to the `main` branch.

---

# 9. Application Monitoring

Monitoring is provided using:

```text
GKE Cluster
    ↓
Prometheus
    ↓
Grafana
    ↓
Monitoring Dashboards
```

The monitoring system provides visibility into:

* CPU usage
* Memory usage
* Pod status
* Node status
* Resource utilization
* Kubernetes workload health

---

# 10. Useful Troubleshooting Commands

Check all application pods:

```bash
kubectl get pods -n bloomworld
```

Check pod details:

```bash
kubectl describe pod POD_NAME -n bloomworld
```

Check application logs:

```bash
kubectl logs POD_NAME -n bloomworld
```

Check deployments:

```bash
kubectl get deployments -n bloomworld
```

Check HPA:

```bash
kubectl get hpa -n bloomworld
```

Check Gateway:

```bash
kubectl get gateway -n bloomworld
```

Check HTTPRoute:

```bash
kubectl get httproute -n bloomworld
```

Check Argo CD application:

```bash
kubectl get applications -n argocd
```

Check monitoring pods:

```bash
kubectl get pods -n monitoring
```

---

## Important Architecture Note

Terraform is responsible for provisioning the **cloud infrastructure**. After the infrastructure is created, Kubernetes tools such as **kubectl and Helm** are used to install and configure:

* Application workloads
* Argo CD
* Prometheus
* Grafana
* Kubernetes RBAC resources


---

For **Grafana access**, you have two options:

### Option 1: Localhost (recommended for README/testing)

If you use:

```bash
kubectl port-forward -n monitoring svc/monitoring-grafana 3000:80
```

Then access:

```text
http://localhost:3000
```

This only works while the terminal command is running.

---

### Option 2: External IP (your current setup)

If you changed the Grafana service to `LoadBalancer`, check:

```bash
kubectl get svc -n monitoring
```

You can access Grafana using:

```text
http://EXTERNAL-IP
```

Since your screenshot shows Grafana running at:

```text
http://34.93.138.xx
```



