import {Cart, Dish} from "../model/model.js";
import {checkToken, decodeToken} from "../user/account.js";
import express from "express";

const router = express.Router()

/* GET: get all dishes */
router.get("/dishes", (request, response) => {
    Dish.find()
        .then((dishes) => {
            response.json(dishes);
        })
        .catch(() => response.status(404).end());
});

/* GET: get dish by id */
router.get("/dishes/:id", (request, response) => {
    Dish.findById(request.params.id)
        .then((dish) => response.json(dish))
        .catch(() => response.status(404).end());
});

/* GET: get all dishes of the Cart */
router.get("/cart", checkToken, (request, response) => {
    const decoded_user = decodeToken(request, response);
    Cart.find({user_id: decoded_user.id})
        .then((cart) => {
            return response.status(200).json(cart);
        });
});

/* GET: get opened cart of user */
router.get("/cart/opened", checkToken, (request, response) => {
    const decoded_user = decodeToken(request, response);
    Cart.findOne({user_id: decoded_user.id, isOpened: true})
        .then((cart) => {
            if (!cart) {
                return response.status(404).json({message: "Error: Cart not found :/"})
            }
            return response.status(200).json(cart);
        });
});

/* GET: get all cart closed of user */
router.get("/cart/closed", checkToken, (request, response) => {
    const decoded_user = decodeToken(request, response);
    Cart.find({user_id: decoded_user.id, isOpened: false})
        .then((cart) => {
            if (!cart) {
                return response.status(404).json({message: "Error: Cart not found :/"})
            }
            return response.status(200).json(cart);
        });
});


export {router as GET_ROUTE}