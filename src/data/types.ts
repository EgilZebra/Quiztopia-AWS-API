export interface LoginParams {
    username: string,
    password: string
}

export interface SignupParams {
    username: string,
    email: string;
    password: string
}

export interface NewUser {
    userId: string,
    username: string,
    email: string,
    password: string
}

export interface passwordCheck {
    status: boolean,
    userID: string
}

export interface ResponseObject {
    statusCode: number,
    headers: object,
    body: string
}
export interface Question {
    question: string, 
    answer: string,
    latitude: number,
    longitude: number
}
export interface QuestionInput {
    quiz: string,
    question: string, 
    answer: string,
    latitude: number,
    longitude: number
}
export interface newQuestion {
    user: string,
    quiz: string,
    question: string, 
    answer: string,
    latitude: number,
    longitude: number
}
export interface newQuiz {
    quizName: string,
    creator: string,
}
export interface Quiz {
    quizName: string,
    creator: string,
    questions: Array<Question>
}
export interface Answer {
    answer: string
    latitude: number,
    longitude: number
}
export interface newAnswer {
    quizName: string,
    username: string,
    answers: Array<Answer>
}
export interface userAnswer {
    result: string, 
    points: string
}
export interface userResult {
    user: string,
    result: string
}