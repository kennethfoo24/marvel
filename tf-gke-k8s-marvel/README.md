
# GKE K8s

Deployment instructions:
 


## Deployment

1. Create GCP project

2. Open Cloud Shell
![Logo](https://i.imgur.com/INpj5Kf.png)

3. Clone this git repo and run the initial setup script

```bash
  git clone https://github.com/kennethfoo24/terraform.git
  cd terraform/tf-gke-k8s/
  ./setup.sh
```

NOTE: If you’d like to modify the default input variables, feel free to modify the tfvars in the setup.sh and k8sCreds.sh script before executing. The following inputs are provided as defaults:

```bash
~/setup.sh

  region          = "us-central1"
  zone            = "us-central1-c"
  location        = "us-central1-c"
  project_id      = "$GOOGLE_CLOUD_PROJECT"
  name            = "kenneth-k8-sample"

~/k8sCreds.sh

  gcloud config set compute/zone us-central1-c

  # Authenticate to your newly created cluster 
  gcloud container clusters get-credentials kenneth-k8-sample --location=us-central1-c

```

4. Authorize Cloud Shell

5. The terraform template main.tf contains the instructions that Google Cloud needs to build out a simple Kubernetes Cluster.  Running terraform plan will list out everything that will be built using the template.  It also acts as a syntax checker for the template.
```bash
  terraform plan
```

6. The terraform apply command will build out the cluster based on what is documented in the main.tf template.  Once the apply is complete you can run the k8sCreds.sh command which will authenticate you to the newly built Kubernetes cluster.  
```bash
  terraform apply --auto-approve
  ./k8sCreds.sh
```



## Tear Down

```bash
  terraform destroy
```


## Creating Resources

```bash
  kubectl expose deployment avengers-nodejs --name avengers-nodejs-lb  --type LoadBalancer --port 80 --target-port 3000
```
```bash
  kubectl expose deployment avengers-delayed-python --name avengers-delayed-python-service  --type ClusterIP --port 80 --target-port 5000
```
```bash
  kubectl expose deployment avengers-security-python --name avengers-security-python-service  --type LoadBalancer --port 80 --target-port 5500
```

Update LB IP Addresses in marvel index.js and client nginx.conf

```bash
  gcloud run deploy kenneth-marvels \
  --image=docker.io/kennethfoo24/frontend-marvel:46dbabffeb34fdd802788e07adebffa938a5cf53 \
  --port=8080 \
  --update-env-vars=DD_API_KEY={API_KEY},DB_USER=admin,DB_HOST=35.232.212.199,DB_NAME=userdb,DB_PASSWORD=securepassword,DB_PORT=5432 \
  --allow-unauthenticated \
  --region=us-central1 \
  --vpc-egress=all-traffic \
  --network=kenneth-marvel-vpc \
  --subnet=kenneth-marvel-subnet
```
