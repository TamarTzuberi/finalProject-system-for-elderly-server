import { Admin } from "../types/admin";
import { config } from "./config";
import {collectionIds} from '../constants/collectionsIds'
// import {elderlyFields} from '../constants/collections'
// import { Meeting } from "../types/meeting";
import { FindOptions, MongoClient } from "mongodb";
import { Projection } from "../constants/mongodbCommands";
import { Gender } from '../types/gender';





export const insertElderly = async (id:string ,username:string, firstName:string, lastName:string, birthYear:number, city:string, email:string, gender:Gender,
    phoneNumber:string) => {
        const client = new MongoClient(config.database.url);
        try{
            await client.connect()
            
            const db = client.db(config.database.name);
            const admins = db.collection<Admin>(collectionIds.admins);
            const existingAdmin =await admins.findOne({ username: username });	
            if(existingAdmin == undefined)
            {
                await admins.insertOne({
                    id,
                    username,
                    firstName,
                    lastName,
                    birthYear,
                    city,
                    email,
                    gender,
                    phoneNumber,
                });
            }
            else{
                console.log("Admin with this userName already exists in the system")
            }
        }
        catch(error){
            console.error(error);
        }
        finally {
            client.close();  
        }
}

