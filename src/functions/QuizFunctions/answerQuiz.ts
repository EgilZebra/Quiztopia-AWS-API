import middy, { MiddyfiedHandler } from "@middy/core";
import { ValidateToken } from "../../middleware/ValidateToken";
import { APIGatewayProxyEvent } from "aws-lambda";
import { ResponseMaker } from "../../services/ResponseMaker";
import { handleParams } from "../../services/handleParams";
import { Answer, newAnswer, Quiz, userAnswer } from "../../data/types";
import { GetQuiz } from "../../services/getQuiz";
import { CompareAnswers } from "../../services/compareAnswers";
import { PutResults } from "../../services/putResults";

export const handler: MiddyfiedHandler = middy()
    .use(ValidateToken)
    .handler(
        async ( event: APIGatewayProxyEvent ) => {
            const eventParams: newAnswer | false = event.body ? JSON.parse(event.body): false;
            if (eventParams === false) {
                return ResponseMaker( 400, "need to send a body!")
            }
            try {
                let requiredFields: (keyof newAnswer)[] = ["quizName", "username", "answers"];
                const reqBody = await handleParams<newAnswer>(eventParams, requiredFields)
                if (typeof reqBody !== 'string') {
                    console.log({reqBody: reqBody})
                    console.log({reqBody: reqBody.answers})
                }
                
                if (typeof reqBody == 'string') {
                    return ResponseMaker( 400, reqBody );
                }
                const CurrentQuiz = await GetQuiz<Quiz>(reqBody.quizName)
                if (typeof CurrentQuiz !== 'string') {
                    console.log({CurrentQuiz: CurrentQuiz[0]})
                    console.log({currentQuestions: CurrentQuiz[0].questions })
                } else if (typeof CurrentQuiz == 'string' ) {
                    return ResponseMaker(400, CurrentQuiz)
                }
                
                if ( CurrentQuiz[0].questions.length !== reqBody.answers.length ) {
                    return ResponseMaker(400, 'You need to answer all the questions')
                }
                const Answers: userAnswer = await CompareAnswers( CurrentQuiz[0].questions, reqBody.answers );
                console.log({Answers: Answers})
                const userResult = { user: reqBody.username, points: Answers.points }
                
                const createdUser: boolean = await PutResults( reqBody.quizName, reqBody.username, userResult.points)
                console.log({createdUser: createdUser})
                if (!createdUser) {
                    return ResponseMaker( 400, 'Unable to post the Results')
                }


                return ResponseMaker( 200, `${reqBody.username}! Your result was ${Answers.result}, for a total of ${Answers.points}-points`)

            } catch (error) {
                return ResponseMaker(500, "service not working properly, sorry!")
            }
        }
    )