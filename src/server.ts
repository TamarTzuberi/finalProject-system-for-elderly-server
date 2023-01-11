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
import researcher from './routers/researcher';
import * as metting from './DButils/meeting';
import bodyParser from "body-parser";
import * as Elderly from './DButils/elderly';
import * as Band from './DButils/band';
import elderly from './routers/elderly';


 
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


/**
 * Server Activation
 */

// Elderly.getElderlyUsers();
//  Elderly.insertElderly("123569485","Avi1","Avi","Levi",1950,"Tel-Aviv","avi@gmail.com",Gender.Male,"0545555555",['sing','sony'],['Hebrew','English'],['service1'],['samsung'],"no additional info","Noa","0524226395");
// Band.insertSleeping("8.5","123569485","12345",new Date());
// Band.insertDepression(4,"123569485","12345",new Date());
// Band.insertLoneliness(3,"123569485","65234",new Date());
// Band.insertPhysicalCondition(3,"123569485","65234",new Date());
// Band.insertSteps(2000,"123569485","12345", new Date(2023, 0, 4));

// metting.insertMeeting("Tamar","Batya",new Date(),"military",2)


// Volunteer.insertVolunteer('Tamar','tamar','tzuberi',1996,'Tel-Aviv','tamar@gmail.com',Gender.Female,['sing','dance'],['Hebrew','English'],['service1'],['samsung'],'0545666666','no additional info');  
// Volunteer.getVolunteerDetails('volunteer1'); 
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });