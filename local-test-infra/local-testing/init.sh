#!/bin/sh

export DOCKER_NET=lambda-net
# spin up dynamoDB
docker run -d --rm --name ddb --network $DOCKER_NET -p 8000:8000 amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb

sleep 6

# aws-cli demands a value even when endpoint is supplied, can be any value
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=dummy-region

echo $AWS_ACCESS_KEY_ID
echo $AWS_SECRET_ACCESS_KEY
echo $AWS_DEFAULT_REGION

# initialize tables
# create Users table
aws dynamodb create-table --table-name Users --attribute-definitions AttributeName=username,AttributeType=S --key-schema AttributeName=username,KeyType=HASH --billing-mode PAY_PER_REQUEST --endpoint-url http://localhost:8000 --region dummy-region | cut -c -80

# aws dynamodb list-tables --endpoint-url http://localhost:8000 --region dummy-region
# aws dynamodb scan --endpoint-url http://localhost:8000 --table-name Users --region dummy-region

# start cognito

docker run -d --rm --name cog --network $DOCKER_NET --publish 9229:9229 --volume $(pwd)/.cognito:/app/.cognito jagregory/cognito-local:latest

sleep 6

aws --endpoint http://localhost:9229 cognito-idp create-user-pool --pool-name usrp | cut -c -80

aws --endpoint http://localhost:9229 cognito-idp create-user-pool-client --user-pool-id usrp --client-name usrpc | cut -c -80

# build lambdas

#cd ../../lambda-a
#npm run build
#cd ../lambda-b
#npm run build
#cd ../cloud-infrastructure
#npm run synth

# start lambdas
sam local start-api --warm-containers EAGER --debug --docker-network $DOCKER_NET -t ./cdk.out/YarnWorkspaceLambdaLayer.template.json --parameter-overrides ParameterKey=COGNITO_CLIENT_ID,ParameterValue=iddididid
