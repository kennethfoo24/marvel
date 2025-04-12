#! /bin/bash

# Ensure GOOGLE_CLOUD_PROJECT is set
if [ -z "$GOOGLE_CLOUD_PROJECT" ]; then
    export GOOGLE_CLOUD_PROJECT=$(gcloud config get-value project)
fi

# Fetch your current public/external IP (this uses an external service).
# You could also use checkip.amazonaws.com or ifconfig.me or ipinfo.io, etc.
MY_IP=$(curl -s http://checkip.amazonaws.com)

# this will create a terraform.tfvars file to be used with cloud shell
cat > terraform.tfvars <<EOF
region          = "us-central1"
zone            = "us-central1-c"
location        = "us-central1-c"
project_id      = "$GOOGLE_CLOUD_PROJECT"
name            = "kenneth-marvel"
network_name    = "kenneth-marvel"
subnet_cidr1    = "10.10.0.0/24"
subnet_cidr2    = "10.11.0.0/24"
node_machine_type = "e2-standard-4"
ssh_source_ip   = "${MY_IP}/32"
EOF

terraform init

# enable GCP APIs 
gcloud services enable container.googleapis.com

gcloud services enable compute.googleapis.com
