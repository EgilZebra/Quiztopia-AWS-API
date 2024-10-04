import { LoginParams, passwordCheck, ResponseObject } from "../../data/types";
import { ResponseMaker, ResponseToken } from "../../services/ResponseMaker";
import { handleParams } from "../../services/handleParams";
import { APIGatewayProxyEvent } from "aws-lambda";
import { ValidatePassword } from "../../services/ValidatePassword";
import * as jwt from "jsonwebtoken";
import 'dotenv/config'

exports.handler = async (event: APIGatewayProxyEvent): Promise<ResponseObject | undefined> => {
    let eventParsed: LoginParams = event.body ? JSON.parse(event.body) : '';
    try {
        let requiredFields: (keyof LoginParams)[] = ["username", "password"];
        let reqBody = await handleParams<LoginParams>( eventParsed, requiredFields );
        if (typeof reqBody == "string") {
            return ResponseMaker( 400, "invalid input" );
        }
        if ( typeof reqBody !== 'string' ){
            const passwordOK: passwordCheck = await ValidatePassword( reqBody );
            if (passwordOK.status){
                const token: string = jwt.sign({ username: passwordOK.userID } , String(process.env.JWT_SECRET), {expiresIn: 3600} );
                return ResponseToken( 200, `password correct, User: ${reqBody.username}. UserID: ${passwordOK.userID[1]}`, token );
            } else {
                return ResponseMaker( 401, 'password incorrect' );
            }
        }
    } catch (error) {
        ResponseMaker( 500, "service not working properly, sorry!" );
    }
};