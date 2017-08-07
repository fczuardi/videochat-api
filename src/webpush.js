// @flow
const webpush = require('web-push');
const config = require('./config');
const {getUser} = require('./db');

webpush.setGCMAPIKey(config.gcm.serverKey);
webpush.setVapidDetails(
  config.webPush.subject,
  config.webPush.pubKey,
  config.webPush.privKey
);

const callUser = async (id) => {
    const user = await getUser(id);
    if (!user.webPushInfo) {
        return new Error('This user dont have a Web Push contact');
    }
    //TBD
    // const pushSubscription = {
      // endpoint: '.....',
      // keys: {
        // auth: '.....',
        // p256dh: '.....'
      // }
    // };

    // webpush.sendNotification(pushSubscription, 'Your Push Payload Text');
}
