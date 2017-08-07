// @flow
const webpush = require("web-push");
const config = require("./config");
const { getUser, getUserGroup } = require("./db");

webpush.setGCMAPIKey(config.gcm.serverKey);
webpush.setVapidDetails(
    config.webPush.subject,
    config.webPush.pubKey,
    config.webPush.privKey
);

type NotificationResPonse = string | { statusCode?: any, headers?: any, body: any };
type NotifyUser = (
    id: string,
    payload: string
) => Promise<NotificationResPonse>;
const notifyUser: NotifyUser = async (userId, payload) => {
    const user = await getUser(userId);
    if (!user.webPushInfo) {
        return { body: { error: "This user dont have a Web Push contact" } };
    }
    const pushSubscription = {
        endpoint: user.webPushInfo.endpoint,
        keys: {
            auth: user.webPushInfo.auth,
            p256dh: user.webPushInfo.key
        }
    };
    return webpush.sendNotification(pushSubscription, payload)
        .then(response => JSON.stringify(response));
};

// broadcast a payload to ALL Available users in a group
type NotifyUserGroup = (
    groupId: string,
    payload: string
) => Promise<NotificationResPonse[] | string[]>;
const notifyUserGroup: NotifyUserGroup = async (groupId, payload) => {
    const userGroup = await getUserGroup(groupId);
    const { availableUsers } = userGroup;
    const notifications = availableUsers.map(userId =>
        notifyUser(userId, payload)
    );
    return Promise.all(notifications);
};

module.exports = {
    notifyUser,
    notifyUserGroup
};
