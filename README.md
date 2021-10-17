# delivecrous

---

To start and stop mongoDb :

```bash
brew services start mongodb-community@5.0
brew services stop mongodb-community@5.0
```

---

### API

| Method | Url | Description |
|:------:|:----|:------------|
| *GET*    | `/dishes`             | Return all dishes |
| *GET*    | `/dishes/id/:id`      | Return one dish by id |
| *GET*    | `/dish/name/:name`    | Return one dish by name |
| *GET*    | `/cart`               | Return all items of Cart client |
| *POST*   | `/cart/post/:id`      | Add a dish in the Cart client |
| *DELETE* | `/cart/delete/:id`    | Delete a dish of the Cart client |
