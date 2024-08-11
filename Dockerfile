# Use an official Nginx image to serve static assets
FROM nginx:1.27.0

RUN rm /usr/share/nginx/html/index.html
RUN rm /usr/share/nginx/html/50x.html

# Copy the static files to the Nginx web root
COPY public /usr/share/nginx/html

# Copy the custom NGINX configuration
COPY public/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the custom NGINX configuration
COPY public/ngx_http_datadog_module.so /usr/lib/nginx/modules

# Expose port 8080
EXPOSE 8080

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]