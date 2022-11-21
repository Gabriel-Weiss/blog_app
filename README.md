Requirements:

[x]RESTfull web service working with JSON data in node.js using express and postgresql two types of users: bloggers and admins
[x]authentication with name/email and password, with sign-up and sign-in for bloggers, but only sign-in for admins

[x]bloggers can create posts
[x]bloggers can update and remove their posts
[x]bloggers can publish and hide their posts
[x]bloggers can see their posts whether they're public or hidden
[x]bloggers can see posts of other bloggers as long as they're public

[x]admins can do everything bloggers can do
[x]admins can remove any public post

Create a .env file in root directory with content:

PORT=<your application port>
NODE_ENV=<your application environment>
DATABASE_NAME=<your application name in database>
DATABASE_USER=<your database user>
DATABASE_PASS=<your database password>
DATABASE_HOST=<your database host>
DATABASE_DIALECT=<your database dialect>
JWT_SECRET=<your jwt secret>
