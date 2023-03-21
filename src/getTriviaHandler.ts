import { APIGatewayEventRequestContext, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { TriviaService, TriviaServiceDynamoDbImpl, TriviaServiceOpenTDbImpl } from './triviaService';
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
  // const triviaService: TriviaService = new TriviaServiceDynamoDbImpl();
  const triviaService: TriviaService = new TriviaServiceOpenTDbImpl();

  const trivias = await triviaService.getQuestions();
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
