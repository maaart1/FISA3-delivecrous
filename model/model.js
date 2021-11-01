const mongoose = require("mongoose");

// TODO Ajuster le cart avec la quantity
const dish_schema = new mongoose.Schema({
    name: String, 
    description: String, 
    price: Number
});

const cart_schema = new mongoose.Schema({
    name: String,
    dishes: [
      {
        quantity: Number,
        dish: dish_schema
      }
    ]
  })

const Dish = mongoose.model("Dish", dish_schema);
const Cart = mongoose.model("Cart", cart_schema);

module.exports = {Dish, Cart};