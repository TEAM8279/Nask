# Endpoints
## Get a token
```bash
GET: /token
```

## Get the notes and tasks
```bash
GET: /datas
```

/!\ protected, you need to pass the token into the bearer

## Update the notes
```bash
POST: /notes
```
### Body
notes
```json
[
    {
    "timestamp": 1695146880,
    "title": "My note",
    "note": "Today is a great day"
  }
]
```

/!\ protected, you need to pass the token into the bearer


## Update the tasks
```bash
POST: /tasks
```
### Body
tasks
```json
[
    {
    "timestamp": 1695146880,
    "task": "Todo",
    "done": false
  }
]
```

/!\ protected, you need to pass the token into the bearer
