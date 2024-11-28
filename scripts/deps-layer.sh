#!/bin/sh

# Install Yarn workspace dependencies to Lambda Layer directory
yarn install --modules-folder lambda-layer/nodejs/node_modules --production

# Copy common utilities
cp -r util-logger/bin/ lambda-layer/nodejs/util-logger
echo '{"main": "logger.js"}' > lambda-layer/nodejs/util-logger/package.json
