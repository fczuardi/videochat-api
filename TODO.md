### Milestones

#### Consierge Demo (Wed, 9 Aug 2017)

Button on a website that calls the web app in the presenters phone.

### WIP
  - [ ]  [Client-Attendant] Allow notifications
  - [ ]  [Client-Attendant] Update user entry to add webpush channel details
  - [ ]  [Architecture, DB, WebPush] include webpush subscription object in the user model
  - [ ]  [Client-Embed] ping attendant 
  - [ ]  [WebPush] include VAPID and GCM credentials in the config file
  - [ ]  [API, WebPush] endpoint for sending notification to another user
  - [x]  [API, DB] list users with filter (from a group, with role attendant, with status available)
  - [x]  [OpenTok] read docs again, see if there is something to store in the backend
  - [x]  [Architecture, DB, API] roles: attendant, user
  - [x]  [Architecture, DB, API] attendant groups (employee/customer)
  - [x]  [Architecture, DB, API] attendant status: available, offline, chatting
  - [x]  [Client-Attendant, signup] create user call 
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
