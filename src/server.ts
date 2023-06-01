/**
 * Required External Modules
 */
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import admin from './routers/admin';
import band from './routers/band';
import user from './routers/user';
import questionnairesR from './routers/questionnaires';
import researcher from './routers/researcher';
import bodyParser from "body-parser";
import subjective from './routers/subjective';
import elderly from './routers/elderly';
import {insertElderly} from './DButils/elderly'
import { Gender } from "./types/gender";
var path = require("path");
var https = require('https');
var fs = require('fs');
var httpsOptions = {
   key: fs.readFileSync(path.join(__dirname, "../privkey.pem")),//server.key
   cert: fs.readFileSync(path.join(__dirname, "../fullchain.pem")),//server.cert
}

/**
 * Get port from environment and store in Express.
 */



dotenv.config();
/**
 * App Variables
 */
if (!process.env.PORT) {
   process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

/**
 *  App Configuration
 */
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, "public"))); //To serve static files such as images, CSS files, and JavaScript files
app.use(express.static(path.join(__dirname, '../../finalProject-system-for-elderly-web/finalProject-system-for-elderly/elderly-research/build')));
app.get("/",function(req,res)
{ 
  res.sendFile(path.join(__dirname, '../../finalProject-system-for-elderly-web/finalProject-system-for-elderly/elderly-research/build/index.html'));
});



app.use("/admin", admin);
app.use("/", band);
app.use("/researcher", researcher);
app.use("/elderly", elderly);
app.use("/users", user);
app.use("/questionnaires", questionnairesR);
app.use("/subjective", subjective);


insertElderly("elderytest@gmail.com",1950,"Tel Aviv",Gender.Female,"less","first","last");


// var port = '443';
// var host = "elderyresearch.cs.bgu.ac.il"
// app.set('port', port);

/**
 * Create HTTP server.
 */
// var server = https.createServer(httpsOptions, app).listen(port, host, () => {
//    console.log(`Server is running on https://${host}:${port}`);
// });;

/**
 * Listen on provided port, on all network interfaces.
 */
// function onError(error: { syscall: string; code: any; }) {
//    if (error.syscall !== 'listen') {
//       throw error;
//    }
//    var bind = typeof port === 'string'
//       ? 'Pipe ' + port
//       : 'Port ' + port;
//    // handle specific listen errors with friendly messages
//    switch (error.code) {
//       case 'EACCES':
//          console.error(bind + ' requires elevated privileges');
//          process.exit(1);
//          break;
//       case 'EADDRINUSE':
//          console.error(bind + ' is already in use');
//          process.exit(1);
//          break;
//       default:
//          throw error;
//    }
// }

/**
 * Event listener for HTTP server "listening" event.
 */
//  address("https://elderyresearch.cs.bgu.ac.il");

// function onListening() {
//    var addr = server.address();
//    var bind = typeof addr === 'string'
//       ? 'pipe ' + addr
//       : 'port ' + addr.port;
//    console.log(`Server listen in port ${port} in adrress ${addr.address}`);
// }



//run localhost
app.listen(PORT, () => {
   console.log(`Listening on port ${PORT}`);
 });