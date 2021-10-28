const express = require("express");
const mongoose = require("mongoose");
const { Dish, Cart } = require("./model/model")

const app = express();s
app.use(express.json());

const jwt = require("jsonwebtoken");
const { response } = require("express");
require("dotenv").config();

const user = {
    id: 42, 
    name: "Martin", 
    email: "martin@gmail.com"
}

function generate_access_token(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '300s'});
}

const access_token = generate_access_token(user);

mongoose.connect("mongodb://localhost:27017/delivecrous");

app.post('/api/login', (request, response) => {
    
})

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

// TODO Supprime plusieurs même dish au lieu que d'en supprimer une seule
// DELETE : delete a dish of the Cart
app.delete("/cart/delete/:id", (request, response) => {
    Dish.findById(request.params.id).then((dish) => {
        Cart.updateOne({name: "Martin"}, {$pull: {dishes: dish}})
            .then((cart) => response.json(cart));
    }).catch(() => response.status(404).end());
    /* Dish.findById(request.params.id).then((dish) => {
        Cart.find({name: "Martin"})
            .then(cart_json => {
                console.log(cart_json[0])
                console.log(dish)
                for (var i = 0; i < cart_json[0].dishes.length; i++) {
                    if (cart_json[0].dishes[i].id === dish.id) {
                        Cart.updateOne({name: "Martin"}, {$pull: {dishes: dish}})
                            .then((cart) => response.json(cart));
                    }
                }
            });
    });*/
});

// GET : Shopping confirmation
app.get("/confirm_shopping", (request, response) => {
    response.json({"name": "Shopping confirmation !"})
})

app.listen(5000);