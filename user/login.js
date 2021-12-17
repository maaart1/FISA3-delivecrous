import {User} from "../model/model.js";
import {createToken} from "./account.js";
import express from "express";

const router = express.Router()

/* POST: sign in with your login and password  */
router.post("/login", (request, response) => {
    if (!request.body.login || !request.body.password) {
        return response.status(404).json({message: 'Error: Please enter login and password :/'})
    }

    User.findOne({username: request.body.login, password: request.body.password})
        .then(user => {
            return response.json({
                token: createToken(user)
            })
        }).catch(error => {
        return response.status(401).json({message: 'Bad Credentials :/'});
    })
})

export {router as LOGIN}