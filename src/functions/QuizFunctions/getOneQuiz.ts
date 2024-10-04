import { APIGatewayProxyEvent } from "aws-lambda";
import { ResponseMaker } from "../../services/ResponseMaker";
import {   ResponseObject } from "../../data/types";
import middy, { MiddyfiedHandler } from "@middy/core";
import { db } from "../../data/db";
import { QueryCommand, QueryCommandOutput } from "@aws-sdk/lib-dynamodb";
    
export const handler: MiddyfiedHandler = middy()
    .handler( async ( event: APIGatewayProxyEvent ): Promise<ResponseObject> => {
        const eventParams = { userId: event.pathParameters?.user, quizName: event.pathParameters?.quiz }
        console.log({eventParams: eventParams})
        try {
            if ( typeof eventParams.quizName == 'string' && typeof eventParams.userId == 'string' ) {
                eventParams.userId = decodeURIComponent(eventParams.userId.replace('_', ' '));
                eventParams.quizName = decodeURIComponent(eventParams.quizName);
            }
            console.log({eventParams: eventParams})
            const DBanswer: QueryCommandOutput = await db.send(new QueryCommand({
                TableName: `Quiz`,
                KeyConditionExpression: " quizName = :quizName ",
                FilterExpression: " creator = :username ",
                ExpressionAttributeValues: {
                    ":quizName": eventParams.quizName,
                    ":username": eventParams.userId
                }

            }));

            console.log({DBanswer: DBanswer.Items})
            let myQuiz: any;
            if (DBanswer.Items !== undefined ){
                myQuiz = DBanswer.Items[0];
                for ( let i = 0 ; i < myQuiz.questions.length ; i++) {
                    myQuiz.questions[i] = myQuiz.questions[i].question
                }   
            }
            
            console.log({ myQuiz: myQuiz })
            return {
                statusCode: 200, 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    quiz: myQuiz.quizName , 
                    creator: myQuiz.creator ,
                    questions: myQuiz.questions})
            };
        } catch (error) {
            console.log(error);
            return ResponseMaker( 500, "service not working properly, sorry!" );
        }
    })