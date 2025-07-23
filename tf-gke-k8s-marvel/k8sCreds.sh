#!/usr/bin/env bash

set -x 
set -e
clusterID="$(terraform output cluster_name)"
# Set your compute zone to match what your terraform is creating
gcloud config set compute/zone us-central1-c

# Authenticate to your newly created cluster 
gcloud container clusters get-credentials kenneth-marvel-k8s-cluster --location=us-central1-c

# Moving tf init to here 
terraform init

# Apply the copied .tf file
terraform apply -auto-approve

# Alias k to kubectl
shopt -s expand_aliases  # Enable alias expansion
alias k="kubectl"        # Alias k to kubectl

# Example usage of the new alias
k get pods