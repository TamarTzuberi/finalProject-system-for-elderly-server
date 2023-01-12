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
// Band.insertHR("123569485",[{"2022-12-27":[{"fpVal":70.5,"mapVal":[]},{"fpVal":75,"mapVal":[]},{"fpVal":65,"mapVal":[]}],"2022-12-28":[{"fpVal":57.43478260869565,"mapVal":[]},{"fpVal":58,"mapVal":[]},{"fpVal":56,"mapVal":[]}],"2022-12-29":[{"fpVal":63.34782608695652,"mapVal":[]},{"fpVal":68,"mapVal":[]},{"fpVal":58,"mapVal":[]}],"2022-12-30":[{"fpVal":66.80434782608695,"mapVal":[]},{"fpVal":67,"mapVal":[]},{"fpVal":66,"mapVal":[]}],"2022-12-31":[{"fpVal":65.19565217391305,"mapVal":[]},{"fpVal":68,"mapVal":[]},{"fpVal":58,"mapVal":[]}],"2023-01-01":[{"fpVal":55.71739130434783,"mapVal":[]},{"fpVal":62,"mapVal":[]},{"fpVal":52,"mapVal":[]}],"2023-01-02":[{"fpVal":63.67391304347826,"mapVal":[]},{"fpVal":68,"mapVal":[]},{"fpVal":57,"mapVal":[]}],"2023-01-03":[{"fpVal":59.56521739130435,"mapVal":[]},{"fpVal":68,"mapVal":[]},{"fpVal":57,"mapVal":[]}],"2023-01-04":[{"fpVal":64.21739130434783,"mapVal":[]},{"fpVal":71,"mapVal":[]},{"fpVal":56,"mapVal":[]}],"2023-01-05":[{"fpVal":61.107142857142854,"mapVal":[]},{"fpVal":69,"mapVal":[]},{"fpVal":60,"mapVal":[]}]}]);
// Band.insertSteps("123569485",[{"2022-12-27":[{"intVal":4890,"mapVal":[]}],"2022-12-28":[{"intVal":4683,"mapVal":[]}],"2022-12-29":[{"intVal":3789,"mapVal":[]}],"2022-12-30":[{"intVal":991,"mapVal":[]}],"2022-12-31":[{"intVal":5401,"mapVal":[]}],"2023-01-01":[{"intVal":5479,"mapVal":[]}],"2023-01-02":[{"intVal":2797,"mapVal":[]}],"2023-01-03":[{"intVal":5763,"mapVal":[]}],"2023-01-04":[{"intVal":2184,"mapVal":[]}],"2023-01-05":[{"intVal":2178,"mapVal":[]}],"2023-01-06":[{"intVal":3673,"mapVal":[]}],"2023-01-07":[{"intVal":5299,"mapVal":[]}],"2023-01-08":[{"intVal":3799,"mapVal":[]}]}]);
// Band.insertActive("123569485",[{"2022-12-27":[{"intVal":100,"mapVal":[]}],"2022-12-28":[{"intVal":103,"mapVal":[]}],"2022-12-29":[{"intVal":784,"mapVal":[]}],"2022-12-30":[{"intVal":163,"mapVal":[]}],"2022-12-31":[{"intVal":128,"mapVal":[]}],"2023-01-01":[{"intVal":87,"mapVal":[]}],"2023-01-02":[{"intVal":90,"mapVal":[]}],"2023-01-03":[{"intVal":130,"mapVal":[]}],"2023-01-04":[{"intVal":89,"mapVal":[]}],"2023-01-05":[{"intVal":33,"mapVal":[]}],"2023-01-07":[{"intVal":63,"mapVal":[]}],"2023-01-08":[{"intVal":94,"mapVal":[]}],"2023-01-09":[{"intVal":52,"mapVal":[]}]}])


// Volunteer.insertVolunteer('Tamar','tamar','tzuberi',1996,'Tel-Aviv','tamar@gmail.com',Gender.Female,['sing','dance'],['Hebrew','English'],['service1'],['samsung'],'0545666666','no additional info');  
// Volunteer.getVolunteerDetails('volunteer1'); 
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });