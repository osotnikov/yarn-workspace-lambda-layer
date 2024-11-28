import {
  type APIGatewayEventDefaultAuthorizerContext,
  type APIGatewayProxyEventBase,
  APIGatewayProxyResult,
  Context
} from "aws-lambda";
import { isTomorrow } from "date-fns";
import { handler } from "../a";

test("Is it tomorrow?", async () => {
  const {body} = await handler({} as APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>, {} as Context, () => {}) as APIGatewayProxyResult;

  expect(isTomorrow(body)).toBeTruthy();
});
