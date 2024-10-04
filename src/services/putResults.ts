import {  UpdateCommand, UpdateCommandOutput } from "@aws-sdk/lib-dynamodb";
import { db } from "../data/db";
import { userResult } from "../data/types";

export const PutResults = async ( quiz: string, user: string, result: string ) => {
    console.log({quiz: quiz, user:user, result: result})
        try {
            const userResult: userResult = { user: user, result: result }
            console.log({userResult: userResult});
            const output: UpdateCommandOutput = await db.send(new UpdateCommand({
                TableName: 'Quiz',
                Key: {
                    "quizName": quiz,
                }, 
                UpdateExpression: "set #r = list_append(if_not_exists(#r, :emptyList), :new_result)",
                ExpressionAttributeNames: {
                    "#r": "result"
                },
                ExpressionAttributeValues: { 
                    ":new_result": [userResult],
                    ":emptyList": []
                },
                ReturnValues: "UPDATED_NEW"
            }))
            return output ? true : false
        } catch (error) {
            console.error("error updating databas:", error)
            return false
        }   
} 