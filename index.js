const express = require("express");
const cors = require("cors");
const config = require("./lib/config");
const api = require("./lib/api");

const { port, path } = config.api;
const app = express();
app.use(cors());
app.use(path, api);
app.listen(port);
console.log(`Running a GraphQL API server at localhost:${port}${path}`);
