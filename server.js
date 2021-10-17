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
});

// GET : get dish by id
app.get("/dishes/id/:id", (request, response) => {
    Dish.findById(request.params.id)
        .then((dish) => response.json(dish))
        .catch(() => response.status(404).end());
});

// GET : get dish by name
app.get("/dishes/name/:name", (request, response) => {
    Dish.find({name: request.params.name})
        .then((dish) => response.json(dish))
        .catch(() => response.status(404).end());
});

// GET : get all dishes of the Cart
app.get("/cart", (request, response) => {
    Cart.find()
        .then((cart) => response.json(cart)) // TODO Changer pour afficher que les dishes du Cart
        .catch(() => response.status(404).end());
});

// POST : add a dish in the Cart
app.post("/cart/post/:id", (request, response) => {
    Dish.findById(request.params.id).then((dish) => {
        Cart.updateOne({name: "Martin"}, {$push: {dishes: dish}})
            .then((cart) => response.json(cart));
        /*Cart.find({name: "Martin"})
            .then(cart_json => {
                console.log(cart_json[0])
                Cart.updateOne(cart_json[0].dishes, dish)
                    .catch(error => {
                        console.log(error)
                    });
            });*/
    }).catch(() => response.status(404).end());
});

// TODO
// DELETE : delete a dish of the Cart
app.delete("/cart/delete/:id", (request, response) => {
    Dish.findById(request.params.id).then((dish) => {
        Cart.updateOne({name: "Martin"}, {$pull: {dishes: dish}})
            .then((cart) => response.json(cart));
    }).catch(() => response.status(404).end());
});

app.listen(5000);