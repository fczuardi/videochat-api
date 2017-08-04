### Milestones

#### Consierge Demo (Wed, 9 Aug 2017)

Button on a website that calls the web app in the presenters phone.

### WIP
  - [ ]  [Client-Attendant] signup flow 
  - [ ]  [Client-Embed] ping attendant 
  - [ ]  [API, DB] list users with filter (from a group, with role attendant, with status available)
  - [ ]  [WebPush] include VAPID and GCM credentials in the config file
  - [ ]  [API, WebPush] endpoint for sending notification to another user
  - [ ]  [Architecture, DB, WebPush] include webpush subscription object in the user model
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
  - [ ]  [OpenTok] read docs again, see if there is something to store in the backend
  - [ ]  [Architecture, DB, API] roles: attendant, user
  - [ ]  [Architecture, DB, API] attendant groups (employee/customer)
  - [ ]  [Architecture, DB, API] attendant status: available, offline, chatting
  - [x]  [API, DB] list users
  - [x]  [Documentation] README with graphQL samples
  - [x]  [API] update / put user mutation
  - [x]  [API] graphql interface
  - [x]  [DB] function to add / update attendants in the db

-----

### extra / future /nice to have

- [ ] Auth
- [ ] precommit hooks
- [ ] use a log lib
- [ ] flow typed definitions for leveldb package
