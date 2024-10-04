import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ResponseMaker } from "../../services/ResponseMaker";
import { handleParams } from "../../services/handleParams";
import { ResponseObject, newQuestion } from "../../data/types";
import { checkQuestion } from "../../services/checkQuestion";
import middy, { MiddyfiedHandler } from "@middy/core";
import { ValidateToken } from "../../middleware/ValidateToken";
import { PutQuestion } from "../../services/PutQuestion";
  
    
export const handler: MiddyfiedHandler = middy()
    .use(ValidateToken)
    .handler(async ( event: APIGatewayProxyEvent ): Promise<ResponseObject> => {
    let eventParsed: newQuestion = event.body ? JSON.parse(event.body) : '';
    let passedChecks: Array<boolean> = [ false, false, false ]
    try {
        let requiredFields: (keyof newQuestion)[] = ["user", "quiz","question","answer","latitude","longitude"];
        const reqBody = await handleParams<newQuestion>(eventParsed, requiredFields);
        if (typeof reqBody == "string") {
            return ResponseMaker( 400, "invalid input" );
        } else {
            passedChecks[0] = true
        }

        if ( typeof reqBody !== 'string' ){
            const userOK: boolean = await checkQuestion(reqBody);
            console.log({userOK: userOK})
            if (!userOK) {
                return ResponseMaker(400,  "Qestion allready exists!");
            } else {
                passedChecks[1] = true
            }
        };
    
        if ( typeof reqBody !== 'string' ) {
            const createdQuiz: boolean = await PutQuestion(reqBody);
            if (!createdQuiz) {
                return ResponseMaker( 400, `Unable to post Question to ${reqBody.quiz}, are you sure you are the creator?!`)
            } else {
                console.log({message: `Created question ${reqBody.question} for your ${reqBody.quiz}-quiz`})
                passedChecks[2] = true
            }
        }

        if ( passedChecks[0]  && passedChecks[1]  && passedChecks[2] ) {
            return ResponseMaker( 200, `Your question has been added to ${reqBody.quiz}!`);            
        } else {
            return ResponseMaker( 400, "Unable to create your quiz, sorry!")
        };

    } catch (error) {
        console.log(error);
        return ResponseMaker( 500, "service not working properly, sorry!" );
    }
});
 
