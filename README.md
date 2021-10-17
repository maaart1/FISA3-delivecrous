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
| *GET*    | `/dishes_by_id/:id`   | Return one dish by id |
| *GET*    | `/dish_by_name/:name` | Return one dish by name |
| *GET*    | `/cart`               | Return all items of Cart client |
| *POST*   | `/cart/:id`           | Add a dish in Cart client |
