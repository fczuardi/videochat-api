// @flow
export type User = {
    id?: string,
    name?: string,
    email?: string,
    groups: string[]
};
type Group = {id: string, name:string, availableUsers:string};

const promisify = require("util.promisify");
const uuid = require("uuid/v4");
const extend = require("xtend");
const db = require("level-sublevel")(require("level")("./db"));

const users = db.sublevel("users", { valueEncoding: "json" });
const userGroups = db.sublevel("userGroups", { valueEncoding: "json" });

const getUser = promisify(users.get);
const putUser = promisify(users.put);
const getUserGroup = promisify(userGroups.get);
const putUserGroup = promisify(userGroups.put);

type MakeUserAvailable = (userId: string) => Promise<string[]>;
const makeUserAvailable:MakeUserAvailable = async function(userId) {
    const user = await getUser(userId);
    if (!user.groups) {
        return [];
    }
    const groups = user.groups;
    let editedGroups = [];
    groups.forEach(groupId =>
        editedGroups.push(
            getUserGroup(groupId).then(group => {
                if (group.availableUsers.includes(userId)) {
                    return null;
                }
                return putUserGroup(
                    groupId,
                    extend(group, {
                        availableUsers: [...group.availableUsers, userId]
                    })
                ).then(() => groupId);
            })
        )
    );
    return Promise.all(editedGroups);
};

type MakeUserUnavailable = MakeUserAvailable;
const makeUserUnavailable:MakeUserUnavailable = async function(userId) {
    const user = await getUser(userId);
    if (!user.groups) {
        return [];
    }
    const groups = user.groups;
    let editedGroups = [];
    groups.forEach(groupId =>
        editedGroups.push(
            getUserGroup(groupId).then(group => {
                if (!group.availableUsers.includes(userId)) {
                    return null;
                }
                return putUserGroup(
                    groupId,
                    extend(group, {
                        availableUsers: group.availableUsers.filter(id => id !== userId)
                    })
                ).then(() => groupId);
            })
        )
    );
    return Promise.all(editedGroups);
};

type CreateUserGroup = (name: string) => Promise<Group>;
const createUserGroup: CreateUserGroup = name => {
    const key = uuid();
    const newGroup = {
        id: key,
        name,
        availableUsers: []
    };
    return putUserGroup(key, newGroup).then(() => newGroup);
};

const listUserGroups = () => {
    return new Promise((resolve, reject) => {
        let values = [];
        const stream = userGroups.createValueStream();
        stream.on("data", data => values.push(data.id));
        stream.on("end", () => resolve(values));
    });
};

type CreateUser = (user:string) => Promise<User>;
const createUser:CreateUser = user => {
    const key = user.id || uuid();
    const newUser = extend(user, { id: key });
    try {
        return putUser(key, newUser).then(() => newUser);
    } catch (err) {
        return err;
    }
};

type UpdateUser = (update: User) => Promise<User>;
const updateUser: UpdateUser = async function(update) {
    try {
        const user = await getUser(update.id);
        const newUser = extend(user, update)
        return putUser(user.id, newUser).then(() => newUser);
    } catch (err) {
        console.error(err)
        return err;
    }
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
