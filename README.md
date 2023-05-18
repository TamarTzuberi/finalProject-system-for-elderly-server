# Eldery - Back

This repository contains the server for a web application designed for researchers studying the elderly from Ben Gurion university of the Negev. The server utilizes the Google Fit API to extract data, creates tables in MongoDB, and includes functions for extracting and inserting data to and from the database.


### Getting Started
1. Clone the repository to your local machine
`git clone https://github.com/YOUR-USERNAME/finalProject-system-for-elderly-server.git`

2. Install the necessary dependencies
`npm install`

3. Set up a MongoDB database and update the connection string in the config.js file.
4. Obtain a Google Fit API key and update the config.js file with the key.
5. Start the server
`npm start`


### Usage
The server includes the following endpoints:

GET /data: Retrieves data from the MongoDB database.

POST /data: Inserts data into the MongoDB database.

GET /google-fit: Retrieves data from the Google Fit API.

