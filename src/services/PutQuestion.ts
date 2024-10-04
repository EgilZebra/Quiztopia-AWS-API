import { db } from "../data/db";
import { UpdateCommand, UpdateCommandOutput } from "@aws-sdk/lib-dynamodb";
import { newQuestion, Question } from "../data/types";

export const PutQuestion = async ( entrie: newQuestion ): Promise< true | false> => {
    try {
        const question: Question = {
            question: entrie.question,
            answer: entrie.answer,
            latitude: entrie.latitude,
            longitude: entrie.longitude
        }
        const createdUser: UpdateCommandOutput = await db.send(new UpdateCommand({
            TableName: 'Quiz',
            Key: {
                "quizName": entrie.quiz,
            }, 
            ConditionExpression: "creator = :creator",
            UpdateExpression: "set questions = list_append(if_not_exists(questions, :emptyList), :new_question)",
            ExpressionAttributeValues: {
                ":creator": entrie.user,
                ":new_question": [question],
                ":emptyList": []
            },
            ReturnValues: "UPDATED_NEW"
        }));
        return createdUser ? true : false

    } catch (error) {
        console.log(error);
        console.error('could not create user')
        return false
    }
}