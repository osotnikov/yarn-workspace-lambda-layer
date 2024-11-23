import type {
  APIGatewayProxyEventBase,
  APIGatewayEventDefaultAuthorizerContext,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda';
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand, PutCommandInput, PutCommandOutput,
  // GetCommand,
} from "@aws-sdk/lib-dynamodb";
//import { Handler } from "aws-lambda";
import { addDays } from "date-fns";
import { logger } from "/opt/nodejs/util-logger";
import {UserDto} from "./UserDto";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>)=> {
  const tomorrow = addDays(new Date(), 1);
  event.body;
  logger(tomorrow);

  const client = new DynamoDBClient({ endpoint: "http://ddb:8000" });
  const dynamo: DynamoDBDocumentClient = DynamoDBDocumentClient.from(client);
  console.log('about to write data to dynamodb');

  const p: PutCommandOutput = await dynamo.send(
      new PutCommand({
        TableName: "Users",
        Item: {
          username: "usr1",
          password: "psw1",
        } as UserDto,
      } as PutCommandInput)
  );


  return {
    'statusCode': 200,
    'body': '' + JSON.stringify(p)
  } as APIGatewayProxyResult;
};
