/**
 * Required External Modules
 */
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { UserRole } from "./types/user";
import * as User from './DButils/user'
import * as Volunteer from './DButils/volunteer'
import { Gender } from "./types/gender";
import admin from './routers/admin';
import band from './routers/band';
import user from './routers/user';
import questionnairesR from './routers/questionnaires';
import researcher from './routers/researcher';
import * as metting from './DButils/meeting';
import bodyParser from "body-parser";
import * as Elderly from './DButils/elderly';
import * as Band from './DButils/band';
import * as Subjective from './DButils/subjective';

import * as Questionnaires from './DButils/questionnaires';
import subjective from './routers/subjective';

import elderly from './routers/elderly';
const bcrypt = require('bcrypt');
import { MongoClient } from 'mongodb';
import { config } from "./DButils/config";

 
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
 app.use(bodyParser.urlencoded({extended:true}));
 app.use(bodyParser.json());
//  app.use(express.json());
 app.use("/admin", admin);
 app.use("/",band);
 app.use("/researcher",researcher);
 app.use("/elderly",elderly);
 app.use("/users",user);
 app.use("/questionnaires",questionnairesR);
 app.use("/subjective",subjective);


/**
 * Server Activation
 */
//  const MongoClient = require('mongodb').MongoClient;

//  // Database configuration
//  const dbName = 'AdminsOfElderlySystem';
//  const url = 'mongodb://localhost:27017';
//  const adminDbName = 'AdminsOfElderlySystem';
//  const adminUsername = 'admin';
//  const adminPassword = 'adminpassword';
 
//  // Create MongoDB client
//  const client = new MongoClient(url, { useUnifiedTopology: true });
 
//  client.connect(function(err: any) {
//    if (err) throw err;
 
//    // Get admin database
//    const adminDb = client.db(adminDbName);
//    adminDb.collection('').insertOne()
//    // Create admin user
//    adminDb.addUser(adminUsername, adminPassword, { roles: ['dbOwner'] }, function(err: any, result: any) {
//      if (err) throw err;
//      console.log('Admin user created successfully');
 
//      // Disconnect from MongoDB server
//      client.close();
//    });
//  });



// Questionnaires.insertQuestionnaires(["q5", "q6", "q7"],1);
// Elderly.getElderlyUsers();
//Elderly.insertElderly("elderlyt@gmail.com",1950,"Ramat Gan",Gender.Female,"lala","kakaa");
// Band.insertSleeping("8.5","123569485","12345",new Date());
// Band.insertDepression(4,"123569485","12345",new Date());
// Subjective.insertDepression("4",new Date("2022-12-28"),3);
// Subjective.insertDepression("4",new Date("2022-12-27"),4);
// Subjective.insertDepression("4",new Date("2022-12-29"),1);
// Subjective.insertPhysicalCondition("4",new Date("2022-12-28"),2);
// Subjective.insertPhysicalCondition("4",new Date("2022-12-27"),4);
// Subjective.insertSleeping("4",new Date("2022-12-29"),5);

// Band.insertPhysicalCondition(3,"123569485","65234",new Date());
// Band.insertSteps(2000,"123569485","12345", new Date(2023, 0, 4));
// const saltRounds = 10; // number of salt rounds to use in the hashing process
// const salt = bcrypt.genSaltSync(saltRounds);
// const hashedPass = bcrypt.hashSync("researcher123456", salt);
// User.insertUser("researcherUser",hashedPass,UserRole.Admin);

// metting.insertMeeting("Tamar","123569485",new Date("2022-12-29"),"military",2);
// metting.insertMeeting("Tamar","123569485",new Date("2022-12-31"),"family",3);
// metting.insertMeeting("Tamar","123569485",new Date("2023-01-02"),"holiday",2);

// ...

//Band.insertLastUpdateDateBand("HR",new Date("2022-12-30"));
// Band.insertActive("123569485",[{"2022-12-27":[{"intVal":100,"mapVal":[]}],"2022-12-28":[{"intVal":103,"mapVal":[]}],"2022-12-29":[{"intVal":784,"mapVal":[]}],"2022-12-30":[{"intVal":163,"mapVal":[]}],"2022-12-31":[{"intVal":128,"mapVal":[]}],"2023-01-01":[{"intVal":87,"mapVal":[]}],"2023-01-02":[{"intVal":90,"mapVal":[]}],"2023-01-03":[{"intVal":130,"mapVal":[]}],"2023-01-04":[{"intVal":89,"mapVal":[]}],"2023-01-05":[{"intVal":33,"mapVal":[]}],"2023-01-07":[{"intVal":63,"mapVal":[]}],"2023-01-08":[{"intVal":94,"mapVal":[]}],"2023-01-09":[{"intVal":52,"mapVal":[]}]}]);
// Band.insertHR("123569485",[{"2022-12-27":[{"fpVal":70.5,"mapVal":[]},{"fpVal":75,"mapVal":[]},{"fpVal":65,"mapVal":[]}],"2022-12-28":[{"fpVal":57.43478260869565,"mapVal":[]},{"fpVal":58,"mapVal":[]},{"fpVal":56,"mapVal":[]}],"2022-12-29":[{"fpVal":63.34782608695652,"mapVal":[]},{"fpVal":68,"mapVal":[]},{"fpVal":58,"mapVal":[]}],"2022-12-30":[{"fpVal":66.80434782608695,"mapVal":[]},{"fpVal":67,"mapVal":[]},{"fpVal":66,"mapVal":[]}],"2022-12-31":[{"fpVal":65.19565217391305,"mapVal":[]},{"fpVal":68,"mapVal":[]},{"fpVal":58,"mapVal":[]}],"2023-01-01":[{"fpVal":55.71739130434783,"mapVal":[]},{"fpVal":62,"mapVal":[]},{"fpVal":52,"mapVal":[]}],"2023-01-02":[{"fpVal":63.67391304347826,"mapVal":[]},{"fpVal":68,"mapVal":[]},{"fpVal":57,"mapVal":[]}],"2023-01-03":[{"fpVal":59.56521739130435,"mapVal":[]},{"fpVal":68,"mapVal":[]},{"fpVal":57,"mapVal":[]}],"2023-01-04":[{"fpVal":64.21739130434783,"mapVal":[]},{"fpVal":71,"mapVal":[]},{"fpVal":56,"mapVal":[]}],"2023-01-05":[{"fpVal":61.107142857142854,"mapVal":[]},{"fpVal":69,"mapVal":[]},{"fpVal":60,"mapVal":[]}]}]);
// Band.insertSteps("10",[{"2022-12-27":[{"intVal":400,"mapVal":[]}],"2022-12-28":[{"intVal":600,"mapVal":[]}],"2022-12-29":[{"intVal":3789,"mapVal":[]}],"2022-12-30":[{"intVal":991,"mapVal":[]}],"2022-12-31":[{"intVal":5401,"mapVal":[]}],"2023-01-01":[{"intVal":5479,"mapVal":[]}],"2023-01-02":[{"intVal":2797,"mapVal":[]}],"2023-01-03":[{"intVal":5763,"mapVal":[]}],"2023-01-04":[{"intVal":2184,"mapVal":[]}],"2023-01-05":[{"intVal":2178,"mapVal":[]}],"2023-01-06":[{"intVal":3673,"mapVal":[]}],"2023-01-07":[{"intVal":5299,"mapVal":[]}],"2023-01-08":[{"intVal":3799,"mapVal":[]}]}]);
// Band.insertPhysicalCondition("123569485",[{"2022-12-27":[{"intVal":4,"mapVal":[]}],"2022-12-28":[{"intVal":5,"mapVal":[]}],"2022-12-29":[{"intVal":5,"mapVal":[]}],"2022-12-30":[{"intVal":6,"mapVal":[]}],"2022-12-31":[{"intVal":5,"mapVal":[]}],"2023-01-01":[{"intVal":3,"mapVal":[]}],"2023-01-02":[{"intVal":4,"mapVal":[]}],"2023-01-03":[{"intVal":6,"mapVal":[]}],"2023-01-04":[{"intVal":5,"mapVal":[]}],"2023-01-05":[{"intVal":5,"mapVal":[]}],"2023-01-07":[{"intVal":7,"mapVal":[]}],"2023-01-08":[{"intVal":7,"mapVal":[]}],"2023-01-09":[{"intVal":9,"mapVal":[]}]}]);


// Volunteer.insertVolunteer('Tamar','tamar','tzuberi',1996,'Tel-Aviv','tamar@gmail.com',Gender.Female,['sing','dance'],['Hebrew','English'],['service1'],['samsung'],'0545666666','no additional info');  
// Volunteer.getVolunteerDetails('volunteer1'); 
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });