# marvel

https://dd-demo-sg.one/

- After deploying the postgres-deployment deployment, expose it as a load balancer.

kubectl expose deployment postgres --name postgres-lb --type LoadBalancer --port 5432 --target-port 5432

