import express from "express";

const router = express.Router()
router.get("*", (request, response) => {
    response.json({message: "Not Found Sorry Man :("})
})

export {router as URL_NOT_EXIST_ROUTE}