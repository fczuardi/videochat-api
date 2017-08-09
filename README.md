# videochat-api
Backend for the [videochat-client][videochat-client] project.

## Install

```
npm install
```

## Config

Edit the **config.toml** file, the [config-sample.toml][configsample] file has a description 
of each config parameter.

The server will fallback to Environment Vars if a config.toml file is not present,
see the [.env-sample][envsample] file for a list of the names.

## Usage

### Launch API server
```
npm start
```

### Use the API manually (GraphiQL)

Make sure the option graphiql is set to true on your config.toml and access your
localhost:port/path and try some of the queries below:

For example **http://localhost:4000/graphql**

## API Reference

https://github.com/fczuardi/videochat-api/blob/master/src/api.js#L63-L79

## Usage

Please consult the [manual][manual] for a tutorial on how to get the whole system up (server and clients).

[videochat-client]: https://github.com/fczuardi/videochat-client
[configsample]: https://github.com/fczuardi/videochat-api/blob/master/config-sample.toml
[envsample]: https://github.com/fczuardi/videochat-api/blob/master/.env-sample
[manual]: https://github.com/fczuardi/videochat-api/blob/master/manual

