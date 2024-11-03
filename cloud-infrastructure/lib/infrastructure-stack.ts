import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {Code, LayerVersion, Runtime} from "aws-cdk-lib/aws-lambda";
import * as nodeLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from "path";

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dependenciesLayer = new LayerVersion(this, "DependenciesLayer", {
      code: Code.fromAsset("../lambda-layer"),
      compatibleRuntimes: [Runtime.NODEJS_20_X]
    });

    // new Function(this, "ALambda", {
    //   code: Code.fromAsset("../lambda-a/bin"),
    //   functionName: "A",
    //   handler: "a.handler",
    //   layers: [dependenciesLayer],
    //   runtime: Runtime.NODEJS_20_X
    // });

    const lambdaAppDir = path.resolve(__dirname, '../../')
    const aLambda: nodeLambda.NodejsFunction =
      new nodeLambda.NodejsFunction(this, 'ALambda', {
        functionName: `aLambda`,
        runtime: lambda.Runtime.NODEJS_20_X,
        layers: [dependenciesLayer],
        depsLockFilePath: path.join(lambdaAppDir, 'yarn.lock'),
        entry: path.join(lambdaAppDir, 'lambda-a/bin/a.js'),
        // entry: path.join(
        //     __dirname,
        //     '../../lambda-a/bin'
        // ),
        memorySize: 1024,
        handler: 'handler',
        environment: {
          LOG_LEVEL: 'DEBUG',
        },
      });

    // new Function(this, "BLambda", {
    //   code: Code.fromAsset("../lambda-b/bin"),
    //   functionName: "B",
    //   handler: "b.handler",
    //   layers: [dependenciesLayer],
    //   runtime: Runtime.NODEJS_20_X
    // });


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
  }
}
