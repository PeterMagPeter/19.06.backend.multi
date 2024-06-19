import dotenv from "dotenv";
dotenv.config() // read ".env"
import { JsonWebTokenError, JwtPayload, sign, verify } from "jsonwebtoken";
import { LoginResource } from "../Resources";
import { login } from "./AuthenticationService"

export async function verifyPasswordAndCreateJWT(email: string, password: string): Promise<string | undefined> {
    const secret = process.env.JWT_SECRET
    const ttl = parseInt(process.env.JWT_TTL!)
    if (!secret || !ttl) throw new Error("Jwt secret or TTL are not defined.")

    const logged = await login(email, password)
    let jwtString = undefined
    if (logged) {
        const payload: JwtPayload = {
            sub: logged?.id
        }
        jwtString = sign(
            payload,
            secret,
            {
                expiresIn: ttl,
                algorithm: "HS256"
            })
    }
    return jwtString
}

export function verifyJWT(jwtString: string | undefined): LoginResource {
    const secret = process.env.JWT_SECRET
    if (jwtString && secret) {
        const payload = verify(jwtString, secret)
        if (payload) {
            return {
                ...payload as LoginResource,
                id: payload.sub!.toString()
            }
        } else throw new JsonWebTokenError("JWTString incorrect.")
    } else {
        throw new Error("JWTString or secret are not defined.")
    }
}
