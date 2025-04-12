# Configure the Google Cloud provider
provider "google" {
  project     = var.project_id
  region      = var.region
}

# Create network based on the network_name variable
resource "google_compute_network" "default" {
  name                    = "${var.name}-vpc"
  auto_create_subnetworks = false
}

# Create subnet based on the network_name, and region variables
resource "google_compute_subnetwork" "default" {
  name                     = "${var.name}-subnet"
  ip_cidr_range            = "10.128.0.0/20"
  network                  = google_compute_network.default.self_link
  region                   = var.region
  private_ip_google_access = true
}

# Create ingress firewall rule
resource "google_compute_firewall" "ingress_allow_ports" {
  name    = "${var.name}-ingress-allow"
  network = google_compute_network.default.self_link

  # Ingress rules
  direction = "INGRESS"
  allow {
    protocol = "tcp"
    ports    = ["80", "443", "5432", "8080", "9090", "30000-30099"]
  }

  # Adjust this range or provide specific CIDRs to narrow who can access these ports
  source_ranges = [
    "173.255.113.66",
    "34.45.150.10",
    "34.132.64.186",
    "35.225.88.131",
    var.ssh_source_ip,
    google_compute_address.nat_ip_1.address,
    google_compute_address.nat_ip_2.address,
    google_compute_address.nat_ip_3.address
  ]
}

# Use this data source to access the configuration of the Google Cloud provider 
data "google_client_config" "current" {
}

# Provides access to available Google Kubernetes Engine versions in a zone or region for a given project.
data "google_container_engine_versions" "default" {
  location = var.location
}

# Create cluster with 3 nodes
resource "google_container_cluster" "default" {
  name               = "${var.name}-k8s-cluster"
  location           = var.location
  initial_node_count = 3
  min_master_version = data.google_container_engine_versions.default.latest_master_version
  deletion_protection = false
  network            = google_compute_network.default.name
  subnetwork         = google_compute_subnetwork.default.name

  node_config {
    machine_type = var.node_machine_type
  }

  # Cluster-level resource labels
  resource_labels = {
    please_keep_my_resource = "true" 
    team         = "sales-eng-apj"
    user         = "kenneth_foo"
    securitydelete = "false"
  }

  provisioner "local-exec" {
    when    = destroy
    command = "sleep 90"
  }
}
# Terraform will output this data once everything has been created
output "network" {
  value = google_compute_subnetwork.default.network
}

output "subnetwork_name" {
  value = google_compute_subnetwork.default.name
}

output "cluster_name" {
  value = google_container_cluster.default.name
}

output "cluster_region" {
  value = var.region
}

####### CLOUD RUN RESOURCE ########

# Create three static external IP addresses for NAT
#
resource "google_compute_address" "nat_ip_1" {
  name   = "${var.name}-nat-ip-1"
  region = var.region
}

resource "google_compute_address" "nat_ip_2" {
  name   = "${var.name}-nat-ip-2"
  region = var.region
}

resource "google_compute_address" "nat_ip_3" {
  name   = "${var.name}-nat-ip-3"
  region = var.region
}

#
# Create (or reference an existing) Cloud Router for the same VPC/region
#
resource "google_compute_router" "nat_router" {
  name    = "${var.name}-nat-router"
  network = google_compute_network.default.self_link
  region  = var.region

  depends_on = [
    google_compute_network.default
  ]

}

# Attach a NAT to this router, using our 3 IPs for outbound traffic
#
resource "google_compute_router_nat" "nat_config" {
  name                               = "${var.name}-cloud-nat"
  router                             = google_compute_router.nat_router.name
  region                             = var.region
  nat_ip_allocate_option             = "MANUAL_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"

  # Attach the 3 static NAT IPs we created
  nat_ips = [
    google_compute_address.nat_ip_1.self_link,
    google_compute_address.nat_ip_2.self_link,
    google_compute_address.nat_ip_3.self_link
  ]

  # Minimum # of ports allocated per VM
  min_ports_per_vm = 4096

  # Optional, but recommended: preserve the same ephemeral port across sessions
  enable_endpoint_independent_mapping = true
}

# Main Cloud Run service resource
resource "google_cloud_run_v2_service" "kenneth_marvel_cloudrun" {
  name     = "${var.name}-cloudrun"
  location = var.region

  template {
      containers {
        image = "docker.io/kennethfoo24/frontend-marvel:46dbabffeb34fdd802788e07adebffa938a5cf53"

        # Expose port 8080 (as in --port=8080)
        ports {
          container_port = 8080
        }

        # Environment variables
        env {
          name  = "DD_API_KEY"
          value = var.DD_API_KEY
        }
        env {
          name  = "DB_USER"
          value = "admin"
        }
        env {
          name  = "DB_HOST"
          value = "35.232.212.199"
        }
        env {
          name  = "DB_NAME"
          value = "userdb"
        }
        env {
          name  = "DB_PASSWORD"
          value = "securepassword"
        }
        env {
          name  = "DB_PORT"
          value = "5432"
        }
      }
    }
}



