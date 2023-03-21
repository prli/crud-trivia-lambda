import { v4 as uuidv4 } from 'uuid';
import * as aws from 'aws-sdk';
import { Trivia } from './getTriviaHandler';
import * as opentdb from 'open-trivia-db';

export interface TriviaService {
  getQuestions(): Promise<Trivia[] | undefined>;
}

export class TriviaServiceDynamoDbImpl implements TriviaService {
  ddbClient: aws.DynamoDB.DocumentClient;
  constructor() {
    // Create the DynamoDB service object
    this.ddbClient = new aws.DynamoDB.DocumentClient();
  }

  async getQuestions() {
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
    const response = await this.ddbClient.scan(params).promise();
    const trivias: Trivia[] | undefined = response.Items?.map((item) => {
      return {
        id: item['pk'] as string,
        question: item['question'] as string,
        answer: item['answer'] as string,
        categories: item['categories'] as string[],
        createdAt: item['createdAt'] as string,
      } as Trivia;
    });
    return trivias;
  }
}

interface OpenTriviaDatabaseResponse {
  id: string;
  question: string;
  answer: string;
  categories: string[];
  createdAt: string;
}

export class TriviaServiceOpenTDbImpl implements TriviaService {
  OPEN_TRIVIA_DATABASE_DOMAIN = 'https://opentdb.com';
  constructor() {
    ('');
  }

  async getQuestions() {
    return opentdb
      .getQuestions({
        amount: 10,
        encode: opentdb.QuestionEncodings.None,
      })
      .then((res) => {
        const trivias: Trivia[] | undefined = res.map((item, i) => {
          return {
            id: `open-trivia-database-random-id-${i}`,
            question: item.value,
            answer: item.correctAnswer,
            categories: [item.category.name],
            createdAt: new Date().toISOString(),
          } as Trivia;
        });
        return Promise.resolve(trivias);
      })
      .catch((err) => {
        throw err;
      });
  }
}
