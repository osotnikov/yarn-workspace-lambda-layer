#!/bin/sh

export DOCKER_NET=lambda-net
# spin up dynamoDB
docker run --rm --name ddb --network $DOCKER_NET -p 8000:8000 amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb

# aws-cli demands a value even when endpoint is supplied, can be any value
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=dummy-regio

# initialize tables
# create Users table
aws dynamodb create-table --table-name Users --attribute-definitions AttributeName=username,AttributeType=S --key-schema AttributeName=username,KeyType=HASH --billing-mode PAY_PER_REQUEST --endpoint-url http://localhost:8000 --region dummy-region

# aws dynamodb list-tables --endpoint-url http://localhost:8000 --region dummy-region
# aws dynamodb scan --endpoint-url http://localhost:8000 --table-name Users --region dummy-region

# start cognito

docker run --network $DOCKER_NET --publish 9229:9229 jagregory/cognito-local:latest

# start lambdas
sam local start-api --docker-network $DOCKER_NET -t ./cdk.out/YarnWorkspaceLambdaLayer.template.json
