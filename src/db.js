// @flow
type User = {
    name?: string,
    email?: string
};
type UserDBCallback = (err: Error | null, value?: User) => void;
type GetUser = (key: string, cb: UserDBCallback) => void;
type PutUser = (key: string, user:User, cb: UserDBCallback) => void;
type UpdateUser = (user: User, cb: UserDBCallback) => void;

const extend = require("xtend");
const db = require("level-sublevel")(require("level")("./db"));

const users = db.sublevel("users", { valueEncoding: "json" });

const getUser : GetUser = (key, cb) =>
    users.get(key, (err, value) => (err ? cb(err) : cb(null, value)));

const putUser: PutUser = (key, user, cb) =>
    users.put(key, user, err => (err ? cb(err) : getUser(key, cb)));

const updateUser: UpdateUser = (user, cb) => {
    const key = user.email;
    if (!key) {
        return cb(new Error("Email is required"));
    }
    return getUser(key, (err, oldUser) => {
        if (err) {
            return err.type === "NotFoundError"
                ? putUser(key, user, cb)
                : cb(err);
        }
        const updatedUser = extend(oldUser, user);
        return putUser(key, updatedUser, cb);
    });
};

module.exports = {
    updateUser
};
