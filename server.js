const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const {Dish, Cart, User} = require("./model/model")

/* Application initialisation */
const app = express();
require("dotenv").config();

app.use(express.json());

/* DataBase Initialisation */
mongoose.connect("mongodb://localhost:27017/delivecrous");

function createToken(user) {
    const token = jwt.sign({
        id: user.id,
        login: user.login
    }, process.env.SECRET_KEY, {expiresIn: '1 hours'})

    return token
}

function decodeToken(request, response) {
    const token = request.headers.authorization && extractBearerToken(request.headers.authorization)
    const decoded_token = jwt.decode(token, {complete: false})
    return decoded_token;
}

const extractBearerToken = headerValue => {
    if (typeof headerValue !== 'string') {
        return false
    }

    const matches = headerValue.match(/(bearer)\s+(\S+)/i)
    return matches && matches[2]
}

const checkToken = (request, response, next) => {
    const token = request.headers.authorization && extractBearerToken(request.headers.authorization)

    if (!token) {
        return response.status(401).json({message: 'Error: You need token to access :/'})
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded_token) => {
        if (err) {
            response.status(401).json({message: 'Error: Bad token :('})
        } else {
            return next()
        }
    })
}

/* -- Route to login or register an account -- */

/* POST : sign in with login and password  */
app.post("/login", (request, response) => {
    if (!request.body.login || !request.body.password) {
        return response.status(404).json({message: 'Error: Please enter login and password :/'})
    }

    User.findOne({username: request.body.login, password: request.body.password})
        .then(user => {
            return response.json({
                token: createToken(user)
            })
        }).catch(error => {
        return response.status(401).json({message: 'Bad Credentials :/'});
    })
})

/* POST : register a new user  */
app.post("/register", (request, response) => {
    if (!request.body.login || !request.body.password) {
        return response.status(404).json({message: 'Error: Please enter login and password :/'})
    }

    User.findOne({login: request.body.login})
        .then(user => {
            if (!user) {
                const new_user = new User(request.body);
                new_user.save().then((new_user) => {
                    return response.json(new_user);
                })
            } else {
                return response.status(403).json({message: 'Error: This user already exists :/'})
            }
        })
})


/* -- Route accessible without an account -- */

/* GET : get all dishes */
app.get("/dishes", (request, response) => {
    Dish.find()
        .then((dishes) => {
            response.json(dishes);
        })
        .catch(() => response.status(404).end());
});

/* GET : get dish by id */
app.get("/dishes/:id", (request, response) => {
    Dish.findById(request.params.id)
        .then((dish) => response.json(dish))
        .catch(() => response.status(404).end());
});

/* GET : get dish by name */
/*app.get("/dishes/name/:name", (request, response) => {
    Dish.find({name: request.params.name})
        .then((dish) => response.json(dish))
        .catch(() => response.status(404).end());
});*/

/* -- Route accessible only with an account -- */

/* GET : get all dishes of the Cart */
app.get("/cart", checkToken, (request, response) => {
    const decoded_user = decodeToken(request, response);
    User.find({login: decoded_user.login})
        .then((user) => {
            user[0].cart.dishes.map((dish) => {
                console.log(dish.dish.price)
                user[0].cart.price += (dish.dish.price * dish.quantity);
                user[0].save().then((user) => response.json(user));
            })
            response.json(user[0].cart);
        })
        .catch(() => response.status(404).end());
});

/* POST : add a dish in the Cart */
// TODO Toujours la même erreur
app.post("/cart", checkToken, (request, response) => {
    const decoded_user = decodeToken(request, response);
    Dish.findById(request.params.id).then((dish_to_save) => {
        User.find({login: decoded_user.login})
            .then((user) => {
                if (user[0].cart.dishes.length !== 0) {
                    user[0].cart.dishes.forEach(dish => {
                        if (dish.dish.id === dish_to_save.id) {
                            dish.quantity += 1;
                            console.log(dish);
                            user[0].save().then((cart) => response.json(cart));
                        } else {
                            user[0].cart.dishes.push({quantity: 1, dish: dish_to_save})
                            user[0].save().then((user) => response.json(user));
                        }
                    });
                } else {
                    user[0].cart.dishes.push({quantity: 1, dish: dish_to_save})
                    user[0].save().then((user) => response.json(user));
                }
            }).catch(() => response.status(404).end());
    })
})

/*app.post("/cart/post/:id", (request, response) => {
    /*Dish.findById(request.params.id).then((dish) => {
        Cart.updateOne({name: "Martin"}, {$push: {dishes: dish}})
            .then((cart) => response.json(cart));*/
/*Dish.findById(request.params.id).then((dish_to_save) => {
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
                        Cart.updateOne({name: "Martin"}, {
                            $push: {
                                dishes: {
                                    quantity: 1,
                                    dish: dish_to_save
                                }
                            }
                        })
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
*/


// TODO Supprime plusieurs même dish au lieu que d'en supprimer une seule
/* DELETE : delete a dish of the Cart */
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

/* GET : Shopping confirmation */
app.get("/confirm_shopping", checkToken, (request, response) => {
    const decoded_user = decodeToken(request, response);
    if (!request.body.address) {
        return response.status(400).json({message: 'Error: Please enter your address :/'})
    }
    User.find({login: decoded_user.login})
        .then((user) => {
            response.status(201).json({
                message: "Confirmed shopping, your order is being prepared and will be sent ! :) You can see your cart compisition :",
                cart: user[0].cart
            })
        })
})

/* GET : Shopping confirmation */
app.get("*", (request, response) => {
    response.json({message: "Not Found Sorry Dude :("})
})
console.log(process.env.PORT)
app.listen(process.env.PORT);