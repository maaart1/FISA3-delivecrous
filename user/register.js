import {User} from "../model/model.js";
import express from "express";

const router = express.Router()

/* POST: register a new user  */
router.post("/register", (request, response) => {
    if (!request.body.login || !request.body.password) {
        return response.status(404).json({message: 'Error: Please enter login and password :/'})
    }

    User.findOne({login: request.body.login})
        .then(user => {
            if (!user) {
                const new_user = new User(request.body);
                new_user.save().then((new_user) => {
                    return response.json(new_user);
                })
            } else {
                return response.status(403).json({message: 'Error: This user already exists :/'})
            }
        })
})

export {router as REGISTER}