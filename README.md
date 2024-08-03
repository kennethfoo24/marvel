# marvel

https://dd-demo-sg.one/

- After deploying the postgres-deployment deployment, expose it as a load balancer.

kubectl expose deployment postgres-deployment --name postgres-deployment-lb --type LoadBalancer --port 5432 --target-port 5432

