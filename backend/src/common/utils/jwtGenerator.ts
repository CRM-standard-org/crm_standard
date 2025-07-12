import { env } from "@common/utils/envConfig";
import jwt from "jsonwebtoken";
const JWT_SECRET = env.JWT_SECRET;


export type TypePayloadGenerate = {
    uuid: string,
}

export const jwtGenerator = {
    generate: async (dataPayload: TypePayloadGenerate) => {
        const token = jwt.sign(dataPayload, JWT_SECRET, { expiresIn: "3h"});
        return token;
    },   
}