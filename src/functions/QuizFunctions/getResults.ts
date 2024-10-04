import middy, { MiddyfiedHandler } from "@middy/core";
import { ResponseMaker } from "../../services/ResponseMaker";
import { APIGatewayProxyEvent } from "aws-lambda";
import { GetQuiz } from "../../services/getQuiz";
import { QueryCommandOutput } from "@aws-sdk/lib-dynamodb";
import { userResult } from "../../data/types";

export const handler: MiddyfiedHandler = middy()
    .handler( async (event: APIGatewayProxyEvent ) => {
        const eventParams: string | undefined = event.pathParameters?.quiz
        if (eventParams == undefined) {
            return ResponseMaker(400, 'need to include input!')
        }
        try {
            const quizItems: QueryCommandOutput | string = await GetQuiz<QueryCommandOutput>( eventParams );
            console.log({quizItems: quizItems});
            if ( typeof quizItems == 'string' ) {
                return ResponseMaker( 400, quizItems)
            }

            const Results: userResult[] = quizItems[0].result;
            console.log({Results: Results});
            Results.sort((a, b) => {
                return Number(a.result) - Number(b.result);
              });        
            console.log({Results: Results});
            const topFive: userResult[] = Results.slice(0, 5) 
            console.log({topFive: topFive});

            return ResponseMaker( 200, topFive )
        } catch (error) {
            console.error(error)
            return ResponseMaker(500, "service not working properly, sorry!")
        }
    })