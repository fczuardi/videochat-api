### WIP
  - [ ]  [API, DB] list users
  - [ ]  [WebPush] include VAPID and GCM credentials in the config file
  - [ ]  [API, WebPush] endpoint for sending notification to another user
  - [x]  [Documentation] README with graphQL samples
  - [x]  [API] update / put user mutation
  - [x]  [API] graphql interface
  - [ ]  [DB, WebPush] include webpush subscription object in the user model
    - it looks like this:
    ```
    {
        "endpoint": "https://updates.push.services.mozilla.com/wpush/v2/gA...vGasFINip-sqz8",
        "keys": {
            "auth":"24m...uUg",
            "p256dh":"BGA5X...jU"
        }
    }
    ```
  - [x]  [DB] function to add / update attendants in the db

-----

### extra / future /nice to have

- [ ] Auth
- [ ] precommit hooks
- [ ] use a log lib
- [ ] flow typed definitions for leveldb package
