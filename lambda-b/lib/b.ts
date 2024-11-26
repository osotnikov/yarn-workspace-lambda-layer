import { Handler } from "aws-lambda";
import { subDays } from "date-fns";
// import {
//   AdminCreateUserRequest,
//   AdminCreateUserResponse,
//   AdminSetUserPasswordRequest, AdminSetUserPasswordResponse
// } from "aws-sdk/clients/cognitoidentityserviceprovider";
// import {AWSError} from "aws-sdk/lib/error";

import {
  // paginateListUserPools,
  CognitoIdentityProviderClient,
  SignUpCommand,
  AdminConfirmSignUpCommand,
  AdminConfirmSignUpCommandInput,
  SignUpCommandInput, CognitoIdentityProviderClientConfig,
} from "@aws-sdk/client-cognito-identity-provider";
import {CheckOptionalClientConfig as __CheckOptionalClientConfig} from "@smithy/types/dist-types/client";
// import {
//   CognitoIdentityProviderClientConfig
// } from "@aws-sdk/client-cognito-identity-provider/dist-types/CognitoIdentityProviderClient";


export const handler: Handler = async () => {


  const cogIdpClInp: CognitoIdentityProviderClientConfig = {
    region: process.env.AWS_REGION,
    endpoint: ""
  } as CognitoIdentityProviderClientConfig;
  // const cogIdpClInp: __CheckOptionalClientConfig<CognitoIdentityProviderClientConfig> = {
  //   region: process.env.AWS_REGION
  // } as __CheckOptionalClientConfig<CognitoIdentityProviderClientConfig>;
  // const cogIdpClInp = {
  //     region: process.env.AWS_REGION,
  //     endpoint: ""
  //   };
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





  /*
  AWS.config.update({region: process.env.AWS_REGION});
  let cidsp = new CognitoIdentityServiceProvider();
  let createUserParams: AdminCreateUserRequest = {
    UserPoolId: process.env.USER_POOL_ID,
    Username: signUpParms.username,
    ForceAliasCreation: false,
    DesiredDeliveryMediums: [
      'EMAIL'
    ],
    MessageAction: 'SUPPRESS',
    TemporaryPassword: 'Password1!'
  };
  let createUserError: AWSError = null;
  await new Promise<void>((resolve, reject) => {
    cidsp.adminCreateUser(createUserParams, (error: AWSError, response: AdminCreateUserResponse) => {
      if(!error && !response) {
        console.error('Neither error nor response received for create user!');
        reject();
      }
      if(error) {
        console.error(`Failed to create user, error: ${JSON.stringify(error)}`)
        createUserError = error;
        reject();
      }
      if(response) {
        console.log(`Create user response received: ${JSON.stringify(response)}`);
        resolve();
      }
    });
  });

  if(createUserError) {
    console.error('returning failure response because create user failed');
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Failed to create user: ${createUserError.message}` }),
    };
  }

  console.log('moving on to setting user password');

  let setPasswordError: AWSError = null;
  let setPasswordParams: AdminSetUserPasswordRequest = {
    UserPoolId: process.env.USER_POOL_ID,
    Username: signUpParms.username,
    Password: signUpParms.password,
    Permanent: true
  };
  await new Promise<void>((resolve, reject) => {
    cidsp.adminSetUserPassword(setPasswordParams, (error: AWSError, response: AdminSetUserPasswordResponse) => {
      if(!error && !response) {
        console.error('Neither error nor response received for set password!');
        reject();
      }
      if(error) {
        console.error(`Failed to set password, error: ${JSON.stringify(error)}`)
        setPasswordError = error;
        reject();
      }
      if(response) {
        console.log(`Set password response received: ${JSON.stringify(response)}`);
        resolve();
      }
    });
  });

  if(setPasswordError) {
    console.error('returning failure response because set password failed');
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Failed to set password: ${setPasswordError.message}` }),
    };
  }

  console.log('moving on to create the user object in dynamodb');
*/
  const yesterday = subDays(new Date(), 1);

  return {
    yesterday: yesterday
  };
};
