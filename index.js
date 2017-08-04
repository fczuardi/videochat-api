const express = require("express");
const { updateUser } = require("./lib/db");
const config = require("./lib/config");
const api = require("./lib/api");

const app = express();
app.use(config.api.path, api);

// add a users in the db if empty and start the api server
// updateUser({ name: "foo2" }, () => null);
updateUser(
    {
        id: "aa1425ef-c338-4be6-a144-2acb361a8e31",
        name: "John Doe",
        email: "mail@example.com"
    },
    (err, user) => {
        console.log("test user update", { err }, { user });
        if (err) {
            throw err;
        }
        app.listen(config.api.port);
        console.log("Running a GraphQL API server at localhost:4000/graphql");
    }
);
