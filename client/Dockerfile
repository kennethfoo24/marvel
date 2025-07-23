# Step 1: Build the React app
FROM node:20.15.0 as build

WORKDIR /app

COPY client/package.json client/package-lock.json ./

RUN npm install

COPY client/. .

RUN npm run build

# Step 2: Serve the React app using an HTTP server
FROM nginx:alpine

RUN rm /usr/share/nginx/html/index.html
RUN rm /usr/share/nginx/html/50x.html

# Copy the static files to the Nginx web root
COPY --from=build /app/build /usr/share/nginx/html

# Copy the custom NGINX configuration
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080
EXPOSE 8080

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
