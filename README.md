![Test status](https://magnum.travis-ci.com/sedge/opendojo.svg?token=Pq9BJTQsrUUEcKjEssNY&branch=master)

# Table of Contents

1. Prerequisites
2. Installation
3. Environment
4. API Reference
5. Tests

---

## 1) Prerequisites
The following global dependencies are required for this application:

1. Nodejs v0.10.~ (native)
2. MongoDB (native)
3. React (native)
4. Grunt (npm module)
5. Mocha (npm module)

  **NOTE:** This app has only been thoroughly tested on the most recent versions of Google Chrome (38+), and as of this writing, browser compatibility is not guaranteed for any other platform or version except the ones aforementioned here.

---

## 2) Installation

From the root directory: `npm install`

---
## 3) Environment

### Variables
The server won't run without an environment file in the root directory of the application. Copy the provided `env.dist` file to `.env` and customize as necessary. 

### Database Configuration (Windows 7/8)
After installing MongoDB, in a new command shell, traverse to the `\bin` subdirectory of your MongoDB installation folder. An executable file called `mongod.exe` should be found in there. In this subfolder, you should type in this command to set the database to point to the OpenDojo repository's parent folder with an addition of adding a `\data` subfolder in your path. It does not exist yet, but it will as soon as MongoDB turns on. The command is highlighted below:

    mongod --dbpath C:\["PATH\TO\YOUR\OPENDOJO\PARENT\FOLDER"]\data --port 27017

At this time, adding user data programmatically is required in order for the database to contain valid user credentials for you to sign into the app with. The user generation script is currently localted inside of the `server\scripts` subdirectory of the OpenDojo repository. If you would like sample data for the rest of the modules to be generated for you at this time as well, you may invoke the user and sample data generation scripts simultaneously, e.g. - 

    node _dbSamplesGen.js && node _uGen.js

Naturally, there is also a script to delete this data located in the same subfolder.

### Server Initialization
When ready, `npm start` will spin up the server. The default localhost port the node process has been set to serve at is `8745`.

### Front-end
Before you can view your work, you have to compile the CSS files and ReactJS app files with `grunt build`.

---

## 4) API Reference
### Routes
  Route Name | Available Verbs | Description
--- | --- | ---
`/api/[students OR ranks OR classes OR records]` | `GET, POST` | Used to retrieve all existing records of the requested module from the DB, or adds a new record to the database.
`/api/[student OR rank OR class OR record]/:id` | `GET, PUT, DELETE` | Used to retrieve, edit, or delete a single module record. Requires a valid `id` value.

### Authentication
Our security infrastructure uses the JSON web token protocol alongside node.js. It is sessionless, URL-safe, and claims/roles expandable with relative ease.
##### Data Flow
![alt text](http://i.imgur.com/pb67ZLp.png "Authentication Data Flow Diagrams")
##### Routes
  Route Name | Available Verbs | Description
--- | --- | ---
`/token` | `GET` | Used to generate and retrieve a valid JSON Web Token. Requires valid user credentials in the request headers in order to respond successfully. This route is the de-facto "gateway" to being able to retrieve any subsequent resources from the available module routes.

##### Events
Event Name | Arguments | Child Events | Child Arguments | Description
--- | --- | --- | --- | ---
`logIn` | none | `logInCompleted, logInFailed` | `logInCompleted`: `(token, validUser)`, `logInFailed`: `(error, code)` | Event listeners/handlers for the `GET /token` request and response process. The `logIn.failed()` also listens for any failed `GET` request from the 4 modules in order to properly obstruct any unwanted access to these protected resources.

### Style Guide
We utilize both native and React-based Bootstrap CSS components. Since our front-end relies almost exclusively on React, it would be in your best interest to render any new data or feature using React-Bootstrap components and classes. Any custom styles or colours for our app's elements and general motif have been declared in our `style.less` file and are to be followed as closely as you possibly can. 

If you are planning on adding an element or component which does not have any custom CSS rules already created for it, feel free to add them yourself, but keep in mind that the design and layout choices you will make will be subject to much scrutiny by some very picky people upon review. Try to maintain a consistent feel in comparison to the rest of the app's UI in general.
To see an example of our style guide being used on standard elements and components, you should take a look at our rendered `styleguide.html` page located in the `server` subfolder.
This can be accessed most easily while the server is running at `/styleguide.html`.

---

## 5) Tests

Tests are a `grunt` task that invoke the `mocha` test framework and provide JavaScript linting by running:

```bash
$> grunt test
```
For more information on how to implement unit tests for this app, refer to our `CONTRIBUTING.md` file.
