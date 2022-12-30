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
 app.use(express.json());
 app.use("/admin", admin);
/**
 * Server Activation
 */

//  Volunteer.insertVolunteer('volunteer2','dan','levi',1996,'Tel-Aviv','dan@gmail.com',Gender.Male,['sing','sony'],['Hebrew','English'],['service1'],['sunday'],['samsung'],'0545666666','no additional info');  
// Volunteer.getVolunteerDetails('volunteer1'); 
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });