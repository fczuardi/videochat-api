// @flow
export type User = {
    id?: string,
    name?: string,
    email?: string
};
type UserDBCallback = (err: Error | null, value?: User) => void;

const uuid = require("uuid/v4");
const extend = require("xtend");
const db = require("level-sublevel")(require("level")("./db"));

const users = db.sublevel("users", { valueEncoding: "json" });

type GetUser = (key: string, cb: UserDBCallback) => void;
const getUser: GetUser = (key, cb) =>
    users.get(key, (err, value) => (err ? cb(err) : cb(null, value)));

type PutUser = (key: string, user: User, cb: UserDBCallback) => void;
const putUser: PutUser = (key, user, cb) =>
    users.put(key, user, err => (err ? cb(err) : getUser(key, cb)));

type CreateUser = (user: User, cb: UserDBCallback) => void;
const createUser: CreateUser = (user, cb) => {
    const key = user.id || uuid();
    return putUser(key, extend(user, { id: key }), cb);
};

type UpdateUser = CreateUser;
const updateUser: UpdateUser = (user, cb) => {
    const key = user.id;
    if (!key) {
        return createUser(user, cb);
    }
    return getUser(key, (err, oldUser) => {
        if (err) {
            return err.type === "NotFoundError"
                ? createUser(user, cb)
                : cb(err);
        }
        return putUser(key, extend(oldUser, user), cb);
    });
};

module.exports = {
    getUser,
    createUser,
    updateUser
};
