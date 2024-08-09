# Use an official Nginx image to serve static assets
FROM nginx:alpine

# Copy the custom NGINX configuration
COPY public/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static files to the Nginx web root
COPY public /usr/share/nginx/html

# Expose port 8080
EXPOSE 8080

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]