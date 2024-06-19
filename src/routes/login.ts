import express from "express";
import { body, matchedData, param, validationResult } from "express-validator";
import { verifyJWT, verifyPasswordAndCreateJWT } from "../services/JWTService";

export const loginRouter = express.Router();

//get a user
loginRouter.get("/", async (req, res, next) => {
    try {
        const cookie = req.cookies.access_token
        if (cookie) {
            const userResource = verifyJWT(cookie)
            res.send(userResource);
        }
        else {
            res.clearCookie("access_token")
            res.send(false)
        }
    } catch (error) {
        res.clearCookie("access_token")
        res.send(false)
    }
})

//post
loginRouter.post("/",
    body("email").isString().isLength({ min: 1, max: 100 }),
    body("password").isLength({ min: 1, max: 100 }),
    async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(401).json({ errors: errors.array() })
        }

        try {
            const data = matchedData(req)
            const jwtString = await verifyPasswordAndCreateJWT(data.email, data.password);
            const login = verifyJWT(jwtString)
            const exp = new Date(login.exp * 1000)
            res.cookie("access_token", jwtString, { httpOnly: true, secure: true, sameSite: "none", expires: exp })
            res.status(201).send(login);
        } catch (error) {
            res.clearCookie("access_token")
            res.status(401).send()
        }
    })

//delete
loginRouter.delete("/", async (req, res, next) => {
    res.clearCookie("access_token")
    res.status(204).send()
})