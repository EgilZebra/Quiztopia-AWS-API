import { SignupParams, NewUser, ResponseObject } from "../../data/types";
import { ResponseMaker } from "../../services/ResponseMaker";
import { handleParams } from "../../services/handleParams";
import { checkUser } from "../../services/checkUser";
import * as bcrypt from 'bcryptjs';
import uuidv4 = require('uuid')
import 'dotenv/config'
import { APIGatewayProxyEvent } from "aws-lambda";
import { PutItem } from "../../services/PutItem";

exports.handler = async (event: APIGatewayProxyEvent): Promise<ResponseObject> => {
 
    let passedChecks: Array<boolean> = [ false, false, false ]
    let eventParsed: SignupParams = event.body ? JSON.parse(event.body) : '';
    console.log({eventParsed: eventParsed})
    try {

        let requiredFields: (keyof SignupParams)[] = ["username", "email", "password"];
        let reqBody = await handleParams<SignupParams>( eventParsed, requiredFields );
        console.log({reqBody: reqBody})
        if (typeof reqBody == "string") {
                return ResponseMaker( 400, reqBody ); 
        } else {
            passedChecks[0] = true;
        }

        if ( typeof reqBody !== 'string' ){
                const userOK: boolean = await checkUser(reqBody);
                console.log({userOK: userOK})
                if (!userOK) {
                    return ResponseMaker(400,  "User allready exists!");
                } else {
                    passedChecks[1] = true
                }
        };

        if ( typeof reqBody !== 'string' ) {
            const hashedpassword: string = await bcrypt.hash( reqBody.password, 10 )
            const userId: string = uuidv4.v4();
            const newUser: NewUser =  {
                userId: userId,
                username: reqBody.username,
                email: reqBody.email,
                password: String(hashedpassword)
            }
            const createUser: boolean = await PutItem<NewUser>( newUser, 'Users' );
            console.log({createUser: createUser})
            if (!createUser) {
                return ResponseMaker( 400, "unable to create user!");
            } else {
                console.log({message: `Created new account for ${newUser.username}`})
                passedChecks[2] = true
            }
        } 
        console.log({passedChecks: passedChecks})
        if ( passedChecks[0]  && passedChecks[1]  && passedChecks[2] ) {
            return ResponseMaker( 200, "User have been created successfully! Now you can log in with your new account");            
        } else {
            return ResponseMaker( 400, "Unable to create your user, sorry!")
        };
    } catch (error) {
        console.log(error)
        return ResponseMaker( 500, "service not working properly, sorry!");
    };
};
