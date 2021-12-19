import {checkToken, decodeToken} from "../user/account.js";
import {Cart, Dish, User} from "../model/model.js";
import express from "express";

const router = express.Router()

/* POST: add a dish  */
router.post("/dishes", checkToken, (request, response) => {
    Dish.findOne({name: request.body.name})
        .then((dish) => {
            if (!dish) {
                const new_dish = new Dish(request.body);
                new_dish.save().then((dish) => {
                    return response.status(201).json(dish)
                });
            }
        }).catch(() => response.status(404).end());
})


/* POST: add a dish in the Cart */
router.post("/cart/:id", checkToken, (request, response) => {
    const decoded_user = decodeToken(request, response);

    Cart.findOne({user_id: decoded_user.id, isOpened: true})
        .then((cart) => {
            if (!cart) {
                cart = new Cart({price: 0, address: "", user_id: decoded_user.id, dishes: [], isOpened: true})
                return Promise.all([cart.save(), Dish.findById(request.params.id)])
            }
            return Promise.all([cart, Dish.findById(request.params.id)])
        })
        .then(([cart, dish]) => {
            const dish_in_cart = cart.dishes.find(dish_in => dish_in.dish.id === dish.id)
            if (dish_in_cart) {
                dish_in_cart.quantity += 1;
                cart.price += dish_in_cart.dish.price;
            } else {
                cart.price += dish.price;
                cart.dishes.push({quantity: 1, dish: dish});
            }
            cart.save().then((cart) => response.status(201).json(cart));
        }).catch(() => response.status(404).end());
})

/* POST: Shopping confirmation */
router.post("/confirm_shopping", checkToken, (request, response) => {
    const decoded_user = decodeToken(request, response);
    if (!request.body.address) {
        return response.status(400).json({message: 'Error: Please enter your address :/'})
    }
    User.findOne({login: decoded_user.login})
        .then((user) => {
            console.log(user)
            return Promise.all([user, Cart.findOne({user_id: decoded_user.id, isOpened: true})])
        })
        .then(([user, cart]) => {
                if (!cart) {
                    return response.status(404).json({message: 'Error: Cart not found :/'})
                }
                cart.isOpened = false;
                cart.save();
                user.address = request.body.address;
                user.save().then((user) => {
                    return response.status(200).json({
                        message: "Confirmed shopping, your order is being prepared and will be sent ! :) You can see your cart compisition :",
                        cart: cart
                    })
                })
            }
        )
})

export {router as POST_ROUTE}