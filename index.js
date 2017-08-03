// @flow
const extend = require("xtend");
const db = require("level-sublevel")(require("level")("./db"));

const users = db.sublevel("users", { valueEncoding: "json" });

const getUser = (key, cb) =>
    users.get(key, (err, value) => (err ? cb(err, null) : cb(null, value)));

const putUser = (key, user, cb) =>
    users.put(key, user, err => (err ? cb(err, null) : getUser(key, cb)));

const updateUser = (user, cb) => {
    const key = user.email;
    if (!key) {
        return cb(new Error("Email is required"), null);
    }
    return getUser(key, (err, oldUser) => {
        if (err) {
            return err.type === "NotFoundError"
                ? putUser(key, user, cb)
                : cb(err, null);
        }
        const updatedUser = extend(oldUser, user);
        return putUser(key, updatedUser, cb);
    });
};

// getUser('mail@example.com', (err, user) => {console.log({err}, {user})})
updateUser(
    {
        name: "new name",
        email: "mail@example.com"
    },
    (err, user) => {
        console.log("end", { err }, { user });
    }
);
