const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/delivecrous");
const dish_schema = new mongoose.Schema({name: String, description: String, price: Number});
const cart_schema = new mongoose.Schema({name: String, dishes: [dish_schema]});

const Dish = mongoose.model("Dish", dish_schema);
const Cart = mongoose.model("Cart", cart_schema);

// GET : get all dishes
app.get("/dishes", (request, response) => {
    Dish.find()
        .then((dishes) => {
            response.json(dishes);
        })
})

// GET : get dish by id
app.get("/dishes_by_id/:id", (request, response) => {
    Dish.findById(request.params.id)
        .then((dish) => response.json(dish));
})

// GET : get dish by name
app.get("/dishes_by_name/:name", (request, response) => {
    Dish.find({name: request.params.name})
        .then((dish) => response.json(dish));
})

// GET : get all dish of Cart
app.get("/cart", (request, response) => {
    Cart.find()
        .then((cart) => response.json(cart[0].dishes));
})

// TODO
// POST : create a dish
app.post("/cart/:id", (request, response) => {
    const dish_to_save = Dish.findById(request.params.id).then((dish) => response.json(dish));
    dish_to_save.save().then((dish) => response.json(dish));
})


app.listen(5000);