#!/bin/sh

# Install Yarn workspace dependencies to Lambda Layer directory
yarn install --modules-folder lambda-layer/nodejs/node_modules --production

# Copy common utilities
#cp -r lambda-common/bin/ lambda-layer/nodejs/lambda-common
#echo '{"main": "index.js"}' > lambda-layer/nodejs/lambda-common/package.json
