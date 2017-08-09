# Manual

## Creating your first User Group

User Groups are sets of helpdesk attendants, you can think of them as a single website or company that wants to install the videochat-client embeds on an iframe.

The interface with the database for the purposes of this manual will be via the GraphiQL console, so you will need to temporarily enable that option on your config to follow through.

### Enabling the GraphiQL web interface

Edit the value of the ```graphiql``` property under the [api] section (or the ```api_graphiql``` env var if not using the config file).

![screen shot 2017-08-09 at 15 35 33](https://user-images.githubusercontent.com/7760/29138038-b6034d16-7d18-11e7-8c98-7591d8092eb2.png)

After this, restart the server and open the api console URL in your browser:

![screen shot 2017-08-09 at 15 43 51](https://user-images.githubusercontent.com/7760/29138287-9e915276-7d19-11e7-80d3-faf59b5c6b84.png)

### createUserGroup

Now paste the following code in the left hand side of the console:

```graphql
mutation ($groupName: String) {
  createUserGroup(name: $groupName) {
    id
    name
  }
}
```

Drag the bottom part of the screen named "QUERY VARIABLES" up, and paste the following code in there:

```json
{"groupName": "My first website helpdesk group"}
```

Press the play button or Ctrl+Enter to run the query.

![screen shot 2017-08-09 at 15 53 05](https://user-images.githubusercontent.com/7760/29138697-eba0d0e0-7d1a-11e7-9642-57d830655b95.png)

### userGroups

You can get a list of the existing usergroups with the query:

```graphql
{userGroups}
```

## Create your first user (attendant)

### createUser

With a group created we can now create our first User. The attendants of your helpdesk system will be the users. An user can belong to multiple groups.

Here is a query to create a new user:

```graphql
mutation ($user: UserInput) {
  createUser(user: $user) {
    id
    name
    email
    groups
  }
}
```

```json
{
  "user": {
  	"name": "My First User",
  	"email": "first@example.com",
  	"groups": ["4b798dc7-ad10-4443-be43-de3ce299fa27"]
	}
}
```

## Make your user available to receive calls

### hangupCall

Now that we have an usergoup and an user, we need to inform that this user is available for receiving calls, to do that we can use the hangupCall method:

```graphql
mutation ($userId: ID!) {
  hangupCall(id: $userId)
}
```

```js
{
  "userId": "e72a0d2f-7efc-4e3b-8e1b-882757331ff7"
}
```

### userGroup

And to make sure that we have indead at least one available user to answer calls we can get the data from our group with:

```graphql
query ($groupId: ID!) {
  userGroup(id: $groupId) {
    name
    availableUsers
  }
}
```

```js
{
    "groupId": "75d33483-485b-487a-a655-25c7b8bede1f"
}
```

## Open the webapp and login with the user

The attendants webapp is the app.html bundle of the videochat-client project, and you can host it on any webserver, including github pages.

Remember to change the api URL on your videochat-client config.toml before generating the bundle.

If you made it right, you should see a page like this:

![screen shot 2017-08-09 at 17 40 02](https://user-images.githubusercontent.com/7760/29142974-f219c81e-7d29-11e7-8fce-b6e5a35d4341.png)

Enter the id of your user as the secret, and click Login.

This should install a service worker capable of running in background on your machine, if you end up in a page that shows your user name and email, it is safe to close the browser.

![screen shot 2017-08-09 at 17 44 10](https://user-images.githubusercontent.com/7760/29143091-665b5f4e-7d2a-11e7-85f6-b35fbc934f3b.png)

## Open the embed passing the group ID in the URL

The embedabble web app to be used on your group's page inside an iframe is the embed.html bundle. What differs one instatiation from another is the group ID passed in the URL, example:

https://fczuardi.github.io/videochat-client/embed.html#group/75d33483-485b-487a-a655-25c7b8bede1f

The ```#group/YOURGROUPID``` part.

If your embed bundle went ok you should see a simple page with a Call button:

![screen shot 2017-08-09 at 17 49 20](https://user-images.githubusercontent.com/7760/29143344-1fd40980-7d2b-11e7-96dc-634303a5dafb.png)

## Push the button

When you push the Call button, all available users in that user group that have made the login and have their service workers running, should receive a notification, even when the browser closed / phone locked:

![screen shot 2017-08-09 at 17 51 05](https://user-images.githubusercontent.com/7760/29143479-bb94b072-7d2b-11e7-8af5-773f661695cf.png)

If an user clicks the notification, it will open a window connecting to that particular chat session:

![screen shot 2017-08-09 at 17 52 19](https://user-images.githubusercontent.com/7760/29143485-beaa1eb4-7d2b-11e7-9e61-4f12a3bd488a.png)


