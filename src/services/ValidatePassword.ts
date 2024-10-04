import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { db } from "../data/db";
import { LoginParams, passwordCheck } from "../data/types";
import * as bcrypt from 'bcryptjs';
import { ScanCommandOutput } from "@aws-sdk/lib-dynamodb";

export const ValidatePassword = async ( user: LoginParams ): Promise<passwordCheck> => {
    try {
        let comparePasswords: boolean;
        const NamedPassword: ScanCommandOutput = await db.send( new ScanCommand({
            TableName: `Users`,
            FilterExpression: "username = :username",
            ExpressionAttributeValues: {
                ":username": { S: user.username},
            }
        }))
        if (NamedPassword.Items && NamedPassword.Items.length > 0) {
            comparePasswords = await bcrypt.compare( user.password , NamedPassword.Items[0].password.S  )
            if (comparePasswords) {
                return { status: comparePasswords, userID: NamedPassword.Items[0].userId }
            } else {
                console.log({message: 'password incorrect' })
                return { status: comparePasswords, userID: '' }
            }
        } else {
            console.log({message: "user does not exist"})
            return { status: false, userID: '' }
        }
        
    } catch (error) {
        console.log({ error: error })
        return { status: false, userID: '' }
    }
}