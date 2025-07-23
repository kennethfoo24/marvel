variable "region" {
    description = "The Project ID you wish to deploy into"
}
variable "zone" {
    description = "The zone within a region to use" 
}
variable "location" {
    description = "Zone removed use location instead error"
}
variable "project_id" {
    description = "The Project to launch into"
}
variable "network_name" {
  description = "Creates name for Network and Cluster"
}
variable "name" {
    description = "Setting a name for resources to use"
}
variable "subnet_cidr1" {
    description = "This will create a cidr range that you can define in the tf vars file"
}
variable "subnet_cidr2" {
    description = "This will create an additional cidr range that you can define in the tf vars file"
}
variable "vpc_connector_ip_cidr_range" {
  type        = string
  description = "Private IP range for the new connector (if you are creating a new one)"
  default     = "10.8.0.0/28"
}
variable "node_machine_type" {
  type        = string
  default     = "e2-medium"
  description = "The machine type to use for nodes in the cluster."
}
variable "ssh_source_ip" {
  type        = string
  description = "CIDR range allowed to SSH into the VM (e.g., x.x.x.x/32 for your public IP)"
  default     = "0.0.0.0/0"  # <-- You can override this in terraform.tfvars or via -var on CLI
}

variable "DD_API_KEY" {
  type        = string
  description = "Datadog API Key"
  sensitive   = true
}


