import { db } from '../data/db';
import { ScanCommand, ScanCommandOutput } from "@aws-sdk/lib-dynamodb";
import { newQuiz } from '../data/types';
import 'dotenv/config'

export const checkQuiz = async ( reqBody: newQuiz ): Promise<boolean> => {
    try {
        const checkUser: ScanCommandOutput = await db.send(new ScanCommand({
            TableName: `Quiz`,
            FilterExpression: "quizName = :quizname",
            ExpressionAttributeValues: {
                ":quizname": reqBody.quizName,
            }
        }));
        if (checkUser.Count === 0) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error);
        console.error("failed to check for quizzez")
        return false
    }
}