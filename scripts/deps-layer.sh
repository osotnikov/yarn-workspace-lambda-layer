#!/bin/sh

# Install Yarn workspace dependencies to Lambda Layer directory
yarn install --modules-folder lambda-layer/nodejs/node_modules --production

# Remove workspace directories from Lambda Layer node_modules
# to prevent circular references
#  lambda-layer/nodejs/node_modules/cloud-infrastructure \
#rm -rf \
#  lambda-layer/nodejs/node_modules/lambda-a \
#  lambda-layer/nodejs/node_modules/lambda-b \
#  lambda-layer/nodejs/node_modules/util-logger

# Copy common utilities
cp -r util-logger/bin/ lambda-layer/nodejs/util-logger
echo '{"main": "logger.js"}' > lambda-layer/nodejs/util-logger/package.json
