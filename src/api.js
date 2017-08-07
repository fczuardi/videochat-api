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
    createUserGroup,
    listUserGroups,
    listUsers,
    makeUserAvailable,
    makeUserUnavailable
} = require("./db");

const OpenTok = require("opentok");

const { opentok: { apiKey, secret } } = config;
const openTok = new OpenTok(apiKey, secret);

const schema = buildSchema(`
type User {
    id: ID!
    name: String
    email: String
    groups: [ID!]
}
type UserGroup {
    id: ID!
    name: String
    availableUsers: [ID!]
}
type Room {
    apiKey: String
    sessionId: String
    token: String
}
type PushServer {
    pubKey: String
}
input UserInput {
    name: String
    email: String
    groups: [ID]
}
type Query {
    users: [ID!]
    user(id: ID!): User
    userGroups: [ID!]
    userGroup(id: ID!): UserGroup
    pushServer: PushServer
    room: Room
}
type Mutation {
    createUser(user: UserInput): User
    updateUser(id: ID!, update: UserInput): User
    createUserGroup(name: String): UserGroup
    hangupCall(id: ID!): [ID]
    answerCall(id: ID!): [ID]
    callUser(id: ID!): String
}
`);

const createPromiseCb = (resolve, reject) => (err, value) =>
    err ? reject(err) : resolve(value);

const root = {
    users: () => listUsers(),
    user: ({ id }) => getUser(id),
    userGroups: () => listUserGroups(),
    userGroup: ({ id }) => getUserGroup(id),
    pushServer: () => ({ pubKey: config.webPush.pubKey }),

    createUser: ({ user }) => createUser(user),
    updateUser: ({ id, update }) => updateUser(extend(update, { id })),
    createUserGroup: ({ name }) => createUserGroup(name),
    hangupCall: ({ id }) => makeUserAvailable(id),
    answerCall: ({ id }) => makeUserUnavailable(id),

    callUser: ({ id }) => {
        return "callUser return TBD";
    },
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
