const { listUsers } = require("./lib/db.js");

listUsers().then(console.log);
