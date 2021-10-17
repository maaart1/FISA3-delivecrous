const express = require("express");
const mongoose = require("mongoose");
const {log} = require("nodemon/lib/utils");

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
        .catch(() => response.status(404).end());
})

// GET : get dish by id
app.get("/dishes/id/:id", (request, response) => {
    Dish.findById(request.params.id)
        .then((dish) => response.json(dish))
        .catch(() => response.status(404).end());
})

// GET : get dish by name
app.get("/dishes/name/:name", (request, response) => {
    Dish.find({name: request.params.name})
        .then((dish) => response.json(dish))
        .catch(() => response.status(404).end());
})

// GET : get all dish of Cart
app.get("/cart", (request, response) => {
    Cart.find()
        .then((cart) => response.json(cart)) // TODO Changer pour afficher que les dishes du Cart
        .catch(() => response.status(404).end());
})

// TODO
// POST : save a dish in Cart
app.put("/cart/:id", (request, response) => {
    Dish.findById(request.params.id).then((dish) => {
        console.log(dish)
        const cart = Cart.find({name: "Martin"})
            .then(cart_json => {
                console.log(cart_json[0])
                Cart.findOneAndUpdate(cart_json[0].dishes, dish)
                    .catch(error => {
                        console.log(error)
                    });
            });

    }).catch(error => {
        console.log(error)
    });
})

app.listen(5000);