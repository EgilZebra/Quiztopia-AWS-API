import { db } from '../data/db';
import { QueryCommand, QueryCommandOutput } from "@aws-sdk/lib-dynamodb";
import { newQuestion, newQuiz } from '../data/types';
import 'dotenv/config'

export const checkQuestion = async ( reqBody: newQuestion ): Promise<boolean> => {
    try {
        const checkUser: QueryCommandOutput = await db.send(new QueryCommand({
            TableName: `Quiz`,
            KeyConditionExpression: "quizName = :quizname",
            FilterExpression: "contains(questions, :question)",
            ExpressionAttributeValues: {
                ":quizname": reqBody.quiz,
                ":question": reqBody.question
            }
        }));
        if (checkUser.Count === 0) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error);
        console.error("failed to check for questions")
        return false
    }
}