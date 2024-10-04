import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import 'dotenv/config'
import { MiddlewareObj, Request } from "@middy/core";
import { ResponseMaker } from "../services/ResponseMaker";

export const ValidateToken: MiddlewareObj = {
    before: async ( req: Request ) => {
        console.log('Middleware triggered');
        console.log('Request event:', req.event);  // Logga hela eventet
        console.log('Request headers:', req.event.headers); 
        try {
            const token: string | false = req.event.headers.Authorization ? req.event.headers.Authorization.replace('Bearer ', '') : false;
            
            if (!token) {
                return ResponseMaker( 400, 'missing authorization token!')
            } 
            console.log('Token:', token);
            const data: JwtPayload | string = jwt.verify( token, String(process.env.JWT_SECRET))
            console.log({JWT_SECRET : process.env.JWT_SECRET})
            if (data.hasOwnProperty('username')) {
                req.event.body.userID = (data as { username: string }).username;
                console.log('Updated event body:', req.event.body);
            }
            console.log({data: data})
            return req.response
        } catch (error) {
            console.log({Error: error});
            return ResponseMaker( 400, 'Token not valid!');
        }
    }
};
