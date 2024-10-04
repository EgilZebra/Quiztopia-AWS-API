import { db } from '../data/db';
import { ScanCommand, ScanCommandOutput } from "@aws-sdk/lib-dynamodb";
import { SignupParams } from '../data/types';
import 'dotenv/config'

export const checkUser = async ( reqBody: SignupParams ): Promise<boolean> => {
    try {
        const checkUser: ScanCommandOutput = await db.send(new ScanCommand({
            TableName: `Users`,
            FilterExpression: "username = :username AND email = :email",
            ExpressionAttributeValues: {
                ":username": reqBody.username,
                ":email": reqBody.email
            }
        }));
        if (checkUser.Count === 0) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error);
        console.error("failed to check for users")
        return false
    }
}
