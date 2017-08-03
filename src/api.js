// @flow
import type { User } from "./db";
type UserQuery = ({ key: string }) => Promise<User | void>;

const { buildSchema } = require("graphql");
const graphqlHTTP = require("express-graphql");
const config = require("./config");
const { getUser, updateUser } = require("./db");

const schema = buildSchema(`
type Query {
    user(key: ID!): User
}
type User {
    name: String,
    email: String
}
`);

const root: { user: UserQuery } = {
    user: ({ key }) =>
        new Promise((resolve, reject) =>
            getUser(key, (err, value) => {
                if (err) {
                    return reject(err);
                }
                return resolve(value);
            })
        ).then(user => user)
};

module.exports = graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: config.api.graphiql
});
