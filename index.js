const {updateUser} = require('./lib/db')

updateUser(
    {
        name: "new name",
        email: "mail@example.com"
    },
    (err, user) => {
        console.log("end", { err }, { user });
    }
);
