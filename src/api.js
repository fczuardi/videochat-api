// @flow
import type { User } from "./db";

const { buildSchema } = require("graphql");
const graphqlHTTP = require("express-graphql");
const extend = require("xtend");
const config = require("./config");
const { getUser, createUser, updateUser } = require("./db");

const schema = buildSchema(`
type User {
    id: ID!
    name: String,
    email: String
}
input UserInput {
    name: String,
    email: String
}
type Query {
    user(id: ID!): User
}
type Mutation {
    createUser(user: UserInput): User,
    updateUser(id: ID!, user: UserInput): User
}
`);

const createPromiseCb = (resolve, reject) => (err, value) =>
    err ? reject(err) : resolve(value);

type apiRoot = {
    user: ({ id: string }) => Promise<User | void>,
    createUser: ({ user: User }) => Promise<User | void>,
    updateUser: ({ id: string, user: User }) => Promise<User | void>
};
const root: apiRoot = {
    user: ({ id }) =>
        new Promise((resolve, reject) =>
            getUser(id, createPromiseCb(resolve, reject))
        ).then(user => user),
    createUser: ({user}) =>
        new Promise((resolve, reject) =>
            createUser(user, createPromiseCb(resolve, reject))
        ).then(user => user),
    updateUser: ({ id, user }) =>
        new Promise((resolve, reject) =>
            updateUser(extend(user, { id }), createPromiseCb(resolve, reject))
        ).then(user => user)
};

module.exports = graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: config.api.graphiql
});
