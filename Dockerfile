# Use an official Nginx image to serve static assets
FROM nginx:alpine

# Copy the static files to the Nginx web root
COPY public /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]