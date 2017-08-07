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
const userGroups = db.sublevel("userGroups", { valueEncoding: "json" });

type GetUser = (key: string, cb: UserDBCallback) => void;
const getUser: GetUser = (key, cb) =>
    users.get(key, (err, value) => (err ? cb(err) : cb(null, value)));

type GetUserGroup = GetUser;
const getUserGroup: GetUserGroup = (key, cb) =>
    userGroups.get(key, (err, value) => (err ? cb(err) : cb(null, value)));

const makeUserUnavailable = userId => {
    return new Promise((resolve, reject) =>
        getUser(userId, (err, user) => {
            if (err) {
                return reject(err);
            }
            const { groups } = user;
            let updatedGroups = [];
            groups.forEach(groupId => {
                updatedGroups.push(
                    new Promise((resolve, reject) => {
                        userGroups.get(groupId, (err, group) => {
                            if (!group.availableUsers.includes(userId)) {
                                return resolve(groupId);
                            }
                            const list = group.availableUsers.filter(
                                id => id !== userId
                            );
                            userGroups.put(
                                groupId,
                                extend(group, {
                                    availableUsers: list
                                }),
                                err => {
                                    if (err) {
                                        return reject(err);
                                    }
                                    return resolve(groupId);
                                }
                            );
                        });
                    })
                );
            });
            return Promise.all(updatedGroups).then(values => {
                resolve(values);
            });
        })
    );
};

const makeUserAvailable = userId => {
    return new Promise((resolve, reject) =>
        getUser(userId, (err, user) => {
            if (err) {
                return reject(err);
            }
            const { groups } = user;
            let updatedGroups = [];
            groups.forEach(groupId => {
                updatedGroups.push(
                    new Promise((resolve, reject) => {
                        userGroups.get(groupId, (err, group) => {
                            if (group.availableUsers.includes(userId)) {
                                return resolve(groupId);
                            }
                            userGroups.put(
                                groupId,
                                extend(group, {
                                    availableUsers: [
                                        ...group.availableUsers,
                                        userId
                                    ]
                                }),
                                err => {
                                    if (err) {
                                        return reject(err);
                                    }
                                    return resolve(groupId);
                                }
                            );
                        });
                    })
                );
            });
            return Promise.all(updatedGroups).then(values => {
                resolve(values);
            });
        })
    );
};

const createUserGroup = name => {
    const key = uuid();
    const newGroup = {
        id: key,
        name,
        availableUsers: []
    };
    console.log({ newGroup });
    return new Promise((resolve, reject) => {
        userGroups.put(
            key,
            newGroup,
            (err, value) => (err ? reject(err) : resolve(newGroup))
        );
    });
};

const listUserGroups = () => {
    return new Promise((resolve, reject) => {
        let values = [];
        const stream = userGroups.createValueStream();
        stream.on("data", data => values.push(data.id));
        stream.on("end", () => resolve(values));
    });
};

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

const listUsers = () =>
    new Promise(resolve => {
        let values = [];
        const stream = users.createValueStream();
        stream.on("data", data => values.push(data.id));
        stream.on("end", () => resolve(values));
    });

module.exports = {
    getUser,
    createUser,
    updateUser,
    listUsers,
    getUserGroup,
    createUserGroup,
    listUserGroups,
    makeUserAvailable,
    makeUserUnavailable
};
