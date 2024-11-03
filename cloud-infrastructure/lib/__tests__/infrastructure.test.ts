import { InfrastructureStack } from "../infrastructure-stack";
import {App} from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

let stack: InfrastructureStack;

beforeAll(() => {
  const app = new App();

  stack = new InfrastructureStack(app, "InfrastructureStack");
});

test("Stack has Lambda resources", () => {

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::Lambda::Function', {
    FunctionName: "aLambda",
    Handler: "index.handler",
    Runtime: "nodejs20.x"
  });

  template.hasResourceProperties("AWS::Lambda::Function", {
    FunctionName: "bLambda",
    Handler: "index.handler",
    Runtime: "nodejs20.x"
  });

});
