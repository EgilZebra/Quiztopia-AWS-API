import { ResponseMaker } from "../../services/ResponseMaker";
import {   ResponseObject } from "../../data/types";
import middy, { MiddyfiedHandler } from "@middy/core";
import { db } from "../../data/db";
import { ScanCommand, ScanCommandOutput } from "@aws-sdk/lib-dynamodb";
    
export const handler: MiddyfiedHandler = middy()
    .handler( async (): Promise<ResponseObject> => {
        try {
            const everyQuiz: ScanCommandOutput = await db.send(new ScanCommand({
                TableName: `Quiz`,
            }));
            console.log({ everyQuiz: everyQuiz })
            let quizResponse: Array<string> = []
            if ( everyQuiz.Items !== undefined ) {
                everyQuiz.Items.forEach(item => {
                    quizResponse.push(`The ${item.quizName}-quiz by ${item.creator}`)
                });
            }
            return ResponseMaker( 200, quizResponse )
        } catch (error) {
            console.log(error);
            return ResponseMaker( 500, "service not working properly, sorry!" );
        }
    })