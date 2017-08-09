require("toml-require").install();
let config = {};
try {
    config = require('../config.toml');
} catch(err) {
    console.error(err);
    console.log('Will fallback tp envConfig');
    config = {
        api: {
            port: parseInt(process.env.api_port, 10),
            path: process.env.api_path, 
            graphiql: process.env.api_graphiql === "true"
        },
        opentok: {
            apiKey: process.env.opentok_apiKey,
            secret: process.env.opentok_secret,
            sessionOptions: {
                mediaMode: process.env.opentok_sessionOptions_mediaMode,
                archiveMode: process.env.opentok_sessionOptions_archiveMode
            }
        },
        webPush: {
            pubKey: process.env.webPush_pubKey,
            privKey: process.env.webPush_privKey,
            subject: process.env.webPush_subject
        },
        gcm: {
            serverKey: process.env.gcm_serverKey
        }
    };

}
module.exports = config;
