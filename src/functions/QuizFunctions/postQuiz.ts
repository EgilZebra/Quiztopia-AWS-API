import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ResponseMaker } from "../../services/ResponseMaker";
import { handleParams } from "../../services/handleParams";
import {  ResponseObject, newQuiz } from "../../data/types";
import { checkQuiz } from "../../services/checkQuiz";
import { PutItem } from "../../services/PutItem";
import middy from "@middy/core";
import { ValidateToken } from "../../middleware/ValidateToken";


    
export const handler = middy()
    .use(ValidateToken)
    .handler(async ( event: APIGatewayProxyEvent ): Promise<ResponseObject> => {
    let eventParsed: newQuiz = event.body ? JSON.parse(event.body) : '';
    let passedChecks: Array<boolean> = [ false, false, false ]
    try {

        let requiredFields: (keyof newQuiz)[] = ["quizName", "creator"];
        const reqBody = await handleParams<newQuiz>(eventParsed, requiredFields);
        if (typeof reqBody == "string") {
            return ResponseMaker( 400, "invalid input" );
        } else {
            passedChecks[0] = true
        }

        // check for other quizzes with the name
        if ( typeof reqBody !== 'string' ){
            const userOK: boolean = await checkQuiz(reqBody);
            console.log({userOK: userOK})
            if (!userOK) {
                return ResponseMaker(400,  "Quiz allready exists!");
            } else {
                passedChecks[1] = true
            }
        };
    
        if ( typeof reqBody !== 'string' ) {
            const createdQuiz: boolean = await PutItem<newQuiz>(reqBody, 'Quiz');
            if (!createdQuiz) {
                return ResponseMaker( 400, 'Unable to create Quiz!')
            } else {
                console.log({message: `Created quiz ${reqBody.quizName} for ${reqBody.creator}`})
                passedChecks[2] = true
            }
        }

        if ( passedChecks[0]  && passedChecks[1]  && passedChecks[2] ) {
            return ResponseMaker( 200, "Your quiz has been created! Time to fill it upp with questions");            
        } else {
            return ResponseMaker( 400, "Unable to create your quiz, sorry!")
        };

    } catch (error) {
        console.log(error);
        return ResponseMaker( 500, "service not working properly, sorry!" );
    }
});
 
// const handler = middy(postQuiz);

// handler.use(ValidateToken);

// module.exports = { handler }