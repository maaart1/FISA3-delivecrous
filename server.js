const express = require("express");
const mongoose = require("mongoose");
const {Dish, Cart, User} = require("./model/model")

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/delivecrous");

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
    /*Dish.findById(request.params.id).then((dish) => {
        Cart.updateOne({name: "Martin"}, {$push: {dishes: dish}})
            .then((cart) => response.json(cart));*/
    Dish.findById(request.params.id).then((dish_to_save) => {
        Cart.findOne({name: "Martin"})
            .then(cart_json => {
                console.log(dish_to_save);
                if (cart_json.dishes.length != 0) {
                    cart_json.dishes.forEach(element => {
                        if (element.dish.id == dish_to_save.id) {
                            element.quantity += 1;
                            console.log(element);
                            cart_json.save().then((cart) => response.json(cart));
                        } else {
                            Cart.updateOne({name: "Martin"}, {$push: {dishes: {quantity: 1, dish: dish_to_save}}})
                                .then((cart) => response.json(cart));
                        }
                    });
                } else {
                    Cart.updateOne({name: "Martin"}, {$push: {dishes: {quantity: 1, dish: dish_to_save}}})
                        .then((cart) => response.json(cart));
                }
            }).catch(() => response.status(404).end());
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