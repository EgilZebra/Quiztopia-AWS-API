import { Answer, Question, userAnswer } from "../data/types";

export const CompareAnswers = async ( questions: Array<Question>, answers: Array<Answer>): Promise<userAnswer> => {
    let points: number = 0;
    let results: Array<Array<string>> = [];
    console.log({questions: questions})
    console.log({answers: answers})
    console.log({points: points})
    for ( let i = 0 ; i < questions.length ; i++ ) {
        let currentResult: Array<string> = [`${i+1}:`];   
        if ( questions[i].answer === answers[i].answer ) {
            points++;
            currentResult.push('true')
        } else {
            currentResult.push('false')
        }
        if ( questions[i].longitude === answers[i].longitude ) {
            points++;
            currentResult.push('true')
        } else {
            currentResult.push('false')
        }
        if ( questions[i].latitude === answers[i].latitude) {
            points++;
            currentResult.push('true')
        } else {
            currentResult.push('false')
        }
        results.push(currentResult)
    }
    const response: userAnswer = { points: String(points), result: String(results)}
    return response
}
