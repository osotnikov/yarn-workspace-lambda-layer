import { Handler } from "aws-lambda";

import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  AdminConfirmSignUpCommand,
  AdminConfirmSignUpCommandInput,
  SignUpCommandInput, CognitoIdentityProviderClientConfig,
} from "@aws-sdk/client-cognito-identity-provider";


export const handler: Handler = async () => {

  console.log(`region: ${process.env.AWS_REGION}`)
  const cogIdpClInp: CognitoIdentityProviderClientConfig = {
    region: process.env.AWS_REGION,
    endpoint: "http://cog:9229/",
  } as CognitoIdentityProviderClientConfig;
  const cognitoIdentityProviderClient = new CognitoIdentityProviderClient(cogIdpClInp);

  // sign up
  const signUpCommandInput: SignUpCommandInput = {

    ClientId: "123",
    Username: "usr1",
    Password: "psw1",
    // UserAttributes: [{ Name: "email", Value: "email@email.com" }],
  } as SignUpCommandInput;
  const signUpCommand = new SignUpCommand(signUpCommandInput);

  const signUpResponse = cognitoIdentityProviderClient.send(signUpCommand);
  console.log(JSON.stringify(signUpResponse))

  // sign up verification (admin)
  const adminConfirmSignUpCommandInput: AdminConfirmSignUpCommandInput = { // AdminConfirmSignUpRequest
    UserPoolId: process.env.USER_POOL_ID, // required
    Username: signUpCommandInput.Username, // required
  } as AdminConfirmSignUpCommandInput;
  const command = new AdminConfirmSignUpCommand(adminConfirmSignUpCommandInput);
  const response = await cognitoIdentityProviderClient.send(command);

  console.log(JSON.stringify(response))

  return JSON.stringify(response);
};
