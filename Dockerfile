# Use an official Nginx image to serve static assets
ARG BASE_IMAGE=nginx:latest
FROM ${BASE_IMAGE}

RUN rm /usr/share/nginx/html/index.html
RUN rm /usr/share/nginx/html/50x.html

# Copy the static files to the Nginx web root
COPY public /usr/share/nginx/html

# Copy the custom NGINX configuration
COPY public/nginx.conf /etc/nginx/nginx.conf

# Install the Datadog tracing module.
COPY ./install_datadog.sh /tmp/
ARG BASE_IMAGE=nginx:latest
ENV BASE_IMAGE=${BASE_IMAGE}
RUN chmod +x /tmp/install_datadog.sh
RUN /tmp/install_datadog.sh

# Expose port 8080
EXPOSE 8080

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]