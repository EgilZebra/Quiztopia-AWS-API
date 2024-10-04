import { ResponseObject } from "../data/types"

export const ResponseMaker = async ( code: number, message: any): Promise<ResponseObject> => {
    const Response: ResponseObject = {
        statusCode: code, 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({message: message})
    }
    return Response
}

export const ResponseToken = async ( code: number, message: any, token: string ): Promise<ResponseObject> => {
    const Response: ResponseObject = {
        statusCode: code, 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({message: message, token: token})
    }
    return Response
}