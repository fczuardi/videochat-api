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



