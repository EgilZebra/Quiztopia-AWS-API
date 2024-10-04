import { QueryCommandOutput, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "../data/db";

export const GetQuiz = async <T>( input: string, ): Promise< T | string> => {
    try {
        const DBanswer: QueryCommandOutput = await db.send(new QueryCommand({
            TableName: `Quiz`,
            KeyConditionExpression: " quizName = :quizName ",
            ExpressionAttributeValues: {
                ":quizName": input
            }
        }));
        console.log({DBanswer: DBanswer})
        return DBanswer.Items as T
    } catch (error) {
        return 'Quiz does not exist'
    }
}