import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Code, LayerVersion, Runtime} from "aws-cdk-lib/aws-lambda";
import * as nodeLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from "path";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class InfrastructureStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const dependenciesLayer = new LayerVersion(this, "DependenciesLayer", {
            code: Code.fromAsset("../lambdas/lambda-layer"),
            compatibleRuntimes: [Runtime.NODEJS_20_X]
        });

        const lambdaAppDir = path.resolve(__dirname, '../../lambdas')
        const aLambda: nodeLambda.NodejsFunction =
            new nodeLambda.NodejsFunction(this, 'ALambda', {
                functionName: `aLambda`,
                runtime: lambda.Runtime.NODEJS_20_X,
                layers: [dependenciesLayer],
                depsLockFilePath: path.join(lambdaAppDir, 'yarn.lock'),
                entry: path.join(lambdaAppDir, 'lambda-a/bin/a.js'),
                memorySize: 1024,
                handler: 'handler',
                environment: {
                    LOG_LEVEL: 'DEBUG',
                },
            });

        const bLambda: nodeLambda.NodejsFunction =
            new nodeLambda.NodejsFunction(this, 'BLambda', {
                functionName: `bLambda`,
                runtime: lambda.Runtime.NODEJS_20_X,
                layers: [dependenciesLayer],
                depsLockFilePath: path.join(lambdaAppDir, 'yarn.lock'),
                entry: path.join(lambdaAppDir, 'lambda-b/bin/b.js'),
                memorySize: 1024,
                handler: 'handler',
                environment: {
                    LOG_LEVEL: 'DEBUG',
                    COGNITO_CLIENT_ID: ''
                },
            });

        // create the api to allow us to create a new product
        const api: apigw.RestApi = new apigw.RestApi(this, 'Api', {
            description: `a-b gw`,
            restApiName: `apigw`,
            deploy: true,
            deployOptions: {
                stageName: 'api',
                dataTraceEnabled: true,
                loggingLevel: apigw.MethodLoggingLevel.INFO
            },
        });

        const apiRoot: apigw.Resource = api.root.addResource('v1');
        const aResource: apigw.Resource = apiRoot.addResource('a');
        aResource.addMethod(
            'POST',
            new apigw.LambdaIntegration(aLambda, {
                proxy: true,
            })
        );
        const bResource: apigw.Resource = apiRoot.addResource('b');
        bResource.addMethod(
            'POST',
            new apigw.LambdaIntegration(bLambda, {
                proxy: true,
            })
        );

        // dynamodb
        new dynamodb.Table(this, 'Table', {
            partitionKey: {name: 'username', type: dynamodb.AttributeType.STRING},
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        });
    }
}
