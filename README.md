# Pupvengers

A web application built to highlight the capabilities of observability and security, monitoring from the frontend to the backend with the ability to capture vulnerabilities and security attacks.

### Built With
The web application is built with the following elements:

• CloudRun (React)

• CloudArmor + CloudNAT

• Kubernetes GKE (Nodejs, Python)

• PostgreSQL

• Datadog


## Demo

### UI
https://dd-demo-sg.one/

![App Screenshot](https://i.imgur.com/8jwCoTY.png)

### Architecture
https://excalidraw.com/#json=WBGj1vSwbqhCb6YusVD7J,Wp-D5roxnhQvVczIZ-G22A

![App Screenshot](https://i.imgur.com/ameGo3w.png)

### Datadog Dashboard

![App Screenshot](https://i.imgur.com/ct1cT6L.png)





### Note

1. create cloud dns

2. update cloud dns to include A record, dont need for AAAA record. For both, point to the frontend public IP of the load balancer.
-- www.dd-demo-sg.com
-- dd-demo-sg.com (for this leave blank)
   
3. create google managed certificate on GCP referring to www.dd-demo-sg.com and dd-demo-sg.com
-- wait for certs to be provisioned
   
4. update load balancer certificate to use cert created in step 3

5. cloud armor delete throttle configuration (prevent rate limiting)






