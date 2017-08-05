// @flow
import type { User } from "./db";

const { buildSchema } = require("graphql");
const graphqlHTTP = require("express-graphql");
const extend = require("xtend");
const config = require("./config");
const {
    getUser,
    getUserGroup,
    createUser,
    updateUser,
    listUsers
} = require("./db");

const OpenTok = require("opentok");

const { opentok: { apiKey, secret } } = config;
const openTok = new OpenTok(apiKey, secret);

const schema = buildSchema(`
type User {
    id: ID!,
    name: String,
    email: String
}
type Room {
    apiKey: String,
    sessionId: String,
    token: String
}
input UserInput {
    name: String,
    email: String
}
type UserGroup {
    id: ID!,
    name: String,
    users: [User]
}
type Query {
    user(id: ID!): User,
    users: [ID!],
    userGroup(id: ID!): UserGroup,
    room: Room
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
    users: () => listUsers(),
    user: ({ id }) =>
        new Promise((resolve, reject) =>
            getUser(id, createPromiseCb(resolve, reject))
        ).then(user => user),
    useerGroup: ({ id }) =>
        new Promise((resolve, reject) =>
            getUserGroup(id, createPromiseCb(resolve, reject))
        ).then(group => group),
    createUser: ({ user }) =>
        new Promise((resolve, reject) =>
            createUser(user, createPromiseCb(resolve, reject))
        ).then(user => user),
    updateUser: ({ id, user }) =>
        new Promise((resolve, reject) =>
            updateUser(extend(user, { id }), createPromiseCb(resolve, reject))
        ).then(user => user),
    room: () =>
        new Promise((resolve, reject) => {
            return openTok.createSession(
                config.opentok.sessionOptions,
                (err, session) => {
                    if (err) {
                        console.error(err);
                        return reject(err);
                    }
                    const token = openTok.generateToken(session.sessionId);
                    console.log({
                        apiKey: config.opentok.apiKey,
                        sessionId: session.sessionId,
                        token
                    });
                    return resolve({
                        apiKey: config.opentok.apiKey,
                        sessionId: session.sessionId,
                        token
                    });
                }
            );
        })
};

module.exports = graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: config.api.graphiql
});
