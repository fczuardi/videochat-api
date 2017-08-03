const db = require("level-sublevel")(
    require("level")("./db", { valueEncoding: "json" })
);

const users = db.sublevel("users", { valueEncoding: "json" });

const stream = users.createReadStream();

stream.on("data", console.log);
