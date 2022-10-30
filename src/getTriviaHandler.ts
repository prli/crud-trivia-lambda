import { APIGatewayEventRequestContext, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import * as aws from 'aws-sdk';

export interface Trivia {
  id: string;
  question: string;
  answer: string;
  categories: string[];
  createdAt: string;
}

export const getTriviaHandler = async (
  event: APIGatewayProxyEvent,
  context: APIGatewayEventRequestContext,
): Promise<APIGatewayProxyResult> => {
  // Create the DynamoDB service object
  const ddb = new aws.DynamoDB.DocumentClient();

  // https://bahr.dev/2021/01/07/serverless-random-records/
  // https://stackoverflow.com/questions/10666364/aws-dynamodb-pick-a-record-item-randomly
  const params = {
    TableName: 'trivia',
    Limit: 1,
    ExclusiveStartKey: {
      pk: uuidv4(),
    },
    ReturnConsumedCapacity: 'TOTAL',
  };

  // Call DynamoDB to read the item from the table
  const response = await ddb.scan(params).promise();

  const trivias: Trivia[] | undefined = response.Items?.map((item) => {
    return {
      id: item['pk'] as string,
      question: item['question'] as string,
      answer: item['answer'] as string,
      categories: item['categories'] as string[],
      createdAt: item['createdAt'] as string,
    } as Trivia;
  });

  return {
    statusCode: 200,
    headers: { ...corsheaders() },
    body: JSON.stringify(trivias, null, 4),
  };
};

function corsheaders(): { [header: string]: string | number | boolean } {
  return {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
  };
}
