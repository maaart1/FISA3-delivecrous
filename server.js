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

/* POST: sign in with login and password  */
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

/* POST: register a new user  */
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


/* ---------- Route accessible without an account ---------- */

/* GET: get all dishes */
app.get("/dishes", (request, response) => {
    Dish.find()
        .then((dishes) => {
            response.json(dishes);
        })
        .catch(() => response.status(404).end());
});

/* GET: get dish by id */
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

/* ---------- Route accessible only with an account ---------- */

/* POST: add a dish  */
app.post("/dishes", checkToken, (request, response) => {
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

/* GET: get all dishes of the Cart */
app.get("/cart", checkToken, (request, response) => {
    const decoded_user = decodeToken(request, response);
    Cart.find({user_id: decoded_user.id})
        .then((cart) => {
            return response.status(200).json(cart);
        }).catch(() => response.status(404).end());
});

/* GET: get opened cart of user */
app.get("/cart/opened", checkToken, (request, response) => {
    const decoded_user = decodeToken(request, response);
    Cart.findOne({user_id: decoded_user.id, isOpened: true})
        .then((cart) => {
            return response.status(200).json(cart);
        }).catch(() => response.status(404).end());
});

/* GET: get all cart closed of user */
app.get("/cart/closed", checkToken, (request, response) => {
    const decoded_user = decodeToken(request, response);
    Cart.find({user_id: decoded_user.id, isOpened: false})
        .then((cart) => {
            return response.status(200).json(cart);
        }).catch(() => response.status(404).end());
});

/* POST: add a dish in the Cart */
app.post("/cart/:id", checkToken, (request, response) => {
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

/* DELETE: delete a dish of the Cart */
app.delete("/cart/:id", checkToken, (request, response) => {
    const decoded_user = decodeToken(request, response);

    Cart.findOne({user_id: decoded_user.id})
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
app.delete("/dishes/:id", checkToken, (request, response) => {
    Dish.findByIdAndDelete(request.params.id)
        .then((dish) => {
            if (dish) {
                return response.status(200).json(dish)
            }
        }).catch(() => response.status(404).end());
})

/* GET: Shopping confirmation */
app.get("/confirm_shopping", checkToken, (request, response) => {
    const decoded_user = decodeToken(request, response);
    if (!request.body.address) {
        return response.status(400).json({message: 'Error: Please enter your address :/'})
    }
    User.find({login: decoded_user.login})
        .then((user) => {
            Cart.findById(user.id)
                .then((cart) => {
                    cart.isOpened = false;
                    cart.save();
                })
            user.address = request.body.address;
            user.save().then((user) => {
                return response.status(200).json({
                    message: "Confirmed shopping, your order is being prepared and will be sent ! :) You can see your cart compisition :",
                    cart: user[0].cart
                })
            })
        })

})

app.get("*", (request, response) => {
    response.json({message: "Not Found Sorry Man :("})
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT} :)`)
});