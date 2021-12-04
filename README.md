# issueTrackerAPI

A RESTful API that lets a user create an account and track issues.
<br>
## Tech Stack
- MEN
  - MongoDB (Atlas DB with Mongoose driver)
  - Express
  - Node.js
- <b>Password Encryption:</b> bcrypt 
- <b>Caching:</b> Redis
- <b>Authentication:</b> JWT 
- <b>Email Services:</b> nodemailer 

## How it Works?
- When a user registers, an email is sent to the given email address.
- When a user logs in, a JWT token is generated, with the payload containing the user Id. Till the token expires, all the other routes can be accessed.
- Once the token expires, the user must log in again to access the routes.
- Passwords are stored into the database after encryption using bcrypt.
- The issue routes are cached with Redis.

## User URLs
- User Login: [http://localhost:3000/user/login](http://localhost:3000/user/login)
- Register user: [http://localhost:3000/user/register](http://localhost:3000/user/register)
- Update user details: [http://localhost:3000/user/update/:username](http://localhost:3000/user/update/:username)
- Remove user: [http://localhost:3000/user/remove/:username](http://localhost:3000/user/remove/:username)
- Get all user details: [http://localhost:3000/user/getall](http://localhost:3000/user/getall)
- Logout user: [http://localhost:3000/user/logout](http://localhost:3000/user/logout)

## Issue URLs
- Add issue: [http://localhost:3000/issue/add](http://localhost:3000/issue/add)
- Update issue details: [http://localhost:3000/issue/update/:id](http://localhost:3000/issue/update/:id)
- Delete issue: [http://localhost:3000/issue/delete/:issueId](http://localhost:3000/issue/delete/:issueId)
- Get all issue details: [http://localhost:3000/issue/getall](http://localhost:3000/issue/getall)
- Get issue details by id: [http://localhost:3000/issue/get/:id](http://localhost:3000/issue/get/:id)
- Get issue details by query parameters:
  - Get issue by Status: [http://localhost:3000/issue/get?issueStatus="value"](http://localhost:3000/issue/get?issueStatus="value") => "value" can be either "open" or "closed".
  - Get issues created by a user: [http://localhost:3000/issue/get?createdBy="value"](http://localhost:3000/issue/get?createdBy="value") => "value" should be a user id.
