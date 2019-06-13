# Environment
* Back end
  * [Node.js >= 8.10.0](https://nodejs.org/en/)
  * [Dialogflow](https://dialogflow.com/)
  * [MySQL 8.0](https://www.mysql.com/)
* Front end
  * HTML
  * CSS
  * Vanilla JS
* Communication between front and back end happens through [Socket.IO](https://socket.io/)

# Run locally

Clone this repository
```
$ git clone https://github.com/larsfoll/superkraft-chatbot
```
Go to the server folder and install dependencies
```
$ cd server
$ yarn
```
Go to the [Google console of Dialogflow](https://console.dialogflow.com/api-client/#/login), sign in and create a new agent with the desirable settings

Copy .env.template and rename to .env

Go to the settings of the chatbot and copy the project id to DF_PROJECT_ID in .env
```
DF_PROJECT_ID=your-project-id
```
Click the service account underneath the project id and generate a JSON key for that service account, rename to dialogflowKey.json save that keyfile inside the server folder

Replace the project id in the package.json scripts
```
"start": "NODE_ENV=production DF_PROJECT_ID=your-project-id DF_SERVICE_ACCOUNT_PATH=./dialogflowKey.json node index.js",`

"start:dev": "NODE_ENV=development DF_PROJECT_ID=your-project-id DF_SERVICE_ACCOUNT_PATH=./dialogflowKey.json nodemon index.js",
```

Make sure the MySQL server is installed on your Mac. Instructions [here](https://vladster.net/en/instructions/install-mysql-mac/)

Login with root user (default root password is empty), create a new user, grant privileges on the — yet to be created — database and flush privileges
```
$ mysql -u root -p

mysql> CREATE USER 'my-username'@'localhost' IDENTIFIED WITH mysql_native_password BY 'user-password';

mysql> GRANT ALL PRIVILEGES ON superkraft_chatbot. * TO 'my-username'@'localhost';

mysql> FLUSH PRIVILEGES;
```

Add the credentials of the newly created user to .env
```
MYSQL_USER=my-username
MYSQL_PASSWORD=user-password
```

Log user in and execute the script in the server folder to create the database
```
$ mysql -u my-username -p < dbInit
```

Run server
```
$ yarn start
```
or run with nodemon to reload on changes
```
$ yarn start:dev
```
Visit the server on [http://localhost:8000/conversations]() to view all the conversations. Which is by default empty of course.

Open index.html to start a conversation or operator.html to view all the conversations.
