import { db } from "../data/db";
import { PutCommand, PutCommandOutput } from "@aws-sdk/lib-dynamodb";

export const PutItem = async <T extends Record<string, any>>( entrie: T, Table: string ): Promise< true | false> => {
    try {
        const createdUser: PutCommandOutput = await db.send(new PutCommand({
            TableName: Table,
            Item: entrie
        }));
        if (createdUser) {
            return true
        } else {
         return false
        }

    } catch (error) {
        console.log(error);
        console.error('could not create user')
        return false
    }
}