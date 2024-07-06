# Use the official Node.js image
FROM node:21

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy datadog serverless-init and datadog tracer
COPY --from=datadog/serverless-init:1 /datadog-init /app/datadog-init
COPY --from=datadog/dd-lib-js-init /operator-build/node_modules /dd_tracer/node/

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Link source code
ARG DD_GIT_COMMIT_SHA
ENV DD_TAGS="git.repository_url:github.com/kennethfoo24/marvel,git.commit.sha:${DD_GIT_COMMIT_SHA}"

# datadog unified service tagging
ENV DD_SERVICE="avengers-nodejs"
ENV DD_ENV="avengers-app"
ENV DD_VERSION="phase:2"
ENV DD_TRACE_ENABLED=true
ENV DD_SITE='datadoghq.com'
ENV DD_TRACE_PROPAGATION_STYLE='datadog'
ENV DD_LOGS_ENABLED=true
ENV DD_LOGS_INJECTION=true
ENV DD_PROFILING_ENABLED=true
ENV DD_RUNTIME_METRICS_ENABLED=true
ENV DD_APPSEC_ENABLED=true
ENV DD_TRACE_DEBUG=true
ENV DD_TRACE_STARTUP_LOGS=true
ENV DD_TRACE_SAMPLE_RATE=1.0
ENV DD_TRACE_RATE_LIMIT=1000

# Expose the port the app runs on
EXPOSE 3000

# Run the application
ENTRYPOINT ["/app/datadog-init"]
CMD ["node", "index.js"]
