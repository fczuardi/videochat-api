const express = require("express");
const { updateUser } = require("./lib/db");
const api = require("./lib/api");

const app = express();
app.use("/graphql", api);

// add a user in the db if empty and start the api server
updateUser(
    {
        name: "John Doe",
        email: "mail@example.com"
    },
    (err, user) => {
        console.log("test user update", { err }, { user });
        if (err) {
            throw err;
        }
        app.listen(4000);
        console.log("Running a GraphQL API server at localhost:4000/graphql");
    }
);
