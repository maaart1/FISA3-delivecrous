import mongoose from 'mongoose'

const dish_schema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number
});

const cart_schema = new mongoose.Schema({
    price: Number,
    address: String,
    isOpened: Boolean,
    user_id: Object,
    dishes: [
        {
            quantity: Number,
            dish: dish_schema
        }
    ]
})

const user_schema = new mongoose.Schema({
    login: String,
    password: String
})

const Dish = mongoose.model("Dish", dish_schema);
const Cart = mongoose.model("Cart", cart_schema);
const User = mongoose.model("User", user_schema);

export {Dish, Cart, User};