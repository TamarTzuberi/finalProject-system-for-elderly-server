README
This repository contains the server for a web application designed for researchers studying the elderly. The server utilizes the Google Fit API to extract data, creates tables in MongoDB, and includes functions for extracting and inserting data to and from the database.

Getting Started
Clone the repository to your local machine
Copy code
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY
Install the necessary dependencies
Copy code
npm install
Set up a MongoDB database and update the connection string in the config.js file.
Obtain a Google Fit API key and update the config.js file with the key.
Start the server
Copy code
npm start
Usage
The server includes the following endpoints:

GET /data: Retrieves data from the MongoDB database.
POST /data: Inserts data into the MongoDB database.
GET /google-fit: Retrieves data from the Google Fit API.
Contributing
If you wish to contribute to this project, please fork the repository and submit a pull request with your changes.

License
This project is licensed under the MIT License - see the LICENSE file for details.
