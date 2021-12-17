# delivecrous

### API

##### _Route accessible with and without an account :_

|  Method  | Url                | Description                      |
| :------: | :----------------- | :------------------------------- |
|  _GET_   | `/dishes`          | Get all dishes                |
|  _GET_   | `/dishes/:id`      | Get one dish by id            |
|  _POST_  | `/login`           | Sign in with login and password     |
|  _POST_  | `/register`        | Register a new user    |

##### _Route accessible only with an account :_

|  Method  | Url                | Description                      |
| :------: | :----------------- | :------------------------------- |
|  _GET_   | `/cart`            | Get all dishes of Cart client  |
|  _GET_   | `/cart/opened`     | Get the opened Cart of the client  |
|  _GET_   | `/cart/closed`     | Get the closed Carts of the client  |
|  _POST_  | `/dishes`          | Add a new dish    |
|  _POST_  | `/cart/:id`        | Add a dish in the Cart client   |
|  _POST_  | `/confirm-shopping`| Shopping confirmation   |
| _DELETE_ | `/cart/:id`        | Delete a dish of the Cart client |
| _DELETE_ | `/dishes/:id`      | Delete a dish |

### Connexion

The project run on the port 5000.

To start and stop mongoDb (on Mac), run :

```bash
brew services start mongodb-community@5.0
brew services stop mongodb-community@5.0
```

On MongoDb, you need to enter the url of the database what you want to use. By default, the url
is : `mongodb://localhost:27017/delivecrous`.

### Usage

To run the server :

```bash
git clone https://github.com/maaart1/delivecrous.git
```

```bash
cd delivecrous
```

```bash
npm run dev
```

### PostMan

You can find my `delivecrous` collection in the file who's name is : `delivecrous_collection.json`.

To use token, you need to :

* Login on `/login`
* Copy the token
* Select `Headers` on PostMan request
* In `KEY` write `Authorization`
* In `VALUE` write `bearer ${your_token}`
* Now, enjoy :)








