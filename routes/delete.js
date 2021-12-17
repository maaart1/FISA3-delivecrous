import {checkToken, decodeToken} from "../user/account.js";
import {Cart, Dish} from "../model/model.js";
import express from "express";

const router = express.Router()

/* DELETE: delete a dish of the Cart */
router.delete("/cart/:id", checkToken, (request, response) => {
    const decoded_user = decodeToken(request, response);

    Cart.findOne({user_id: decoded_user.id, isOpened: true})
        .then((cart) => {
            if (!cart) {
                return response.status(404).json({message: 'Error: Cart not found :/'});
            }
            return Promise.all([cart, Dish.findById(request.params.id)])
        })
        .then(([cart, dish]) => {
            const dish_in_cart = cart.dishes.find(dish_in => dish_in.dish.id === dish.id)
            if (dish_in_cart) {
                dish_in_cart.quantity -= 1;
                cart.price -= dish_in_cart.dish.price;
            }
            cart.save().then((cart) => response.status(200).json(cart));
        }).catch(() => response.status(404).end());
});

/* DELETE: delete a dish */
router.delete("/dishes/:id", checkToken, (request, response) => {
    Dish.findByIdAndDelete(request.params.id)
        .then((dish) => {
            if (dish) {
                return response.status(200).json(dish)
            }
        }).catch(() => response.status(404).end());
})

export {router as DELETE_ROUTE}