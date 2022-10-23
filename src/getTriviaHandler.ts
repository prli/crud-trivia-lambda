import { APIGatewayEventRequestContext, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const getTriviaHandler = async (event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify([
      {
        "id": `${context.requestId}`,
        "question": `mock trivia question $context.requestTime`,
        "answer": `mock trivia answer $context.requestTime very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long text very long text very long textvery long textvery long text very long text very long text very long text very long textvery long textvery long text very long text ${new Date().getTime()}`,
        "categories": ["categoryOne", "categoryTwo"],
        "createdAt": `${context.requestTime}`,
      },
    ], null, 4),
  }
}