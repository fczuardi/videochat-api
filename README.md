# videochat-api
Backend for the videochat-client project.

## Install

```
npm install
```

## Config

Edit the **config.toml** file.

## Usage

### Launch API server
```
npm start
```

### Use the API manually (GraphiQL)

Make sure the option graphiql is set to true on your config.toml and access your
localhost:port/path and try some of the queries below:

## API

### Users

#### create
```
mutation {
  createUser(user: {name: "John Doe", email: "mail@example.com"}) {
    id
    name
    email
  }
}
```

#### update
```
mutation {
  updateUser(id: "60bbc381-3fd4-4275-a6bd-196b0436db8a", user: {name: "Jane Doe"}) {
    name
    email
    id
  }
}
```

#### get
```
{
  user(id: "60bbc381-3fd4-4275-a6bd-196b0436db8a") {
    name
  }
}
```

### list (TBD)
```
{
  users
}
```
