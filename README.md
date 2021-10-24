# delivecrous

To start and stop mongoDb :

```bash
brew services start mongodb-community@5.0
brew services stop mongodb-community@5.0
```

---

### API

|  Method  | Url                | Description                      |
| :------: | :----------------- | :------------------------------- |
|  _GET_   | `/dishes`          | Return all dishes                |
|  _GET_   | `/dishes/id/:id`   | Return one dish by id            |
|  _GET_   | `/dish/name/:name` | Return one dish by name          |
|  _GET_   | `/cart`            | Return all items of Cart client  |
|  _POST_  | `/cart/post/:id`   | Add a dish in the Cart client    |
| _DELETE_ | `/cart/delete/:id` | Delete a dish of the Cart client |
