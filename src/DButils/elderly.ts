import { config } from "./config";
import {collectionIds} from '../constants/collectionsIds'
// import {elderlyFields} from '../constants/collections'
import { Elderly } from "../types/elderly";
// import { Meeting } from "../types/meeting";
import { FindOptions, MongoClient } from "mongodb";
import { Projection } from "../constants/mongodbCommands";
import { Gender } from '../types/gender';
// import Cookies from 'universal-cookie';

export const insertElderly = async (id:string ,username:string, firstName:string, lastName:string, birthYear:number, city:string, email:string, gender:Gender,
    phoneNumber:string, areasOfInterest:string[], languages:string[], wantedServices:string[],
    digitalDevices:string[], additionalInformation:string, contactName:string, contactPhoneNumber:string) => {
        const client = new MongoClient(config.database.url);
        try{
            await client.connect()
            const db = client.db(config.database.name);
            const elderlies = db.collection<Elderly>(collectionIds.elderlyUsers);
            const existingElderly =await elderlies.findOne({ username: username });	
            if(existingElderly == undefined)
            {
                await elderlies.insertOne({
                    id,
                    username,
                    firstName,
                    lastName,
                    birthYear,
                    city,
                    email,
                    gender,
                    phoneNumber,				
                    areasOfInterest,
                    languages,
                    wantedServices,
                    digitalDevices,
                    additionalInformation,
                    contactName,
                    contactPhoneNumber,
                });
            }
            else{
                console.log("Username already exists in the system")
            }
        }
        catch(error){
            console.error(error);
        }
        finally {
            client.close();  
        }
}

    
export const getElderlyUsers = async() => {
    const client = new MongoClient(config.database.url);
    try{
        await client.connect()
        const db = client.db(config.database.name);
        const elderlies = db.collection<Elderly>(collectionIds.elderlyUsers);
        const cursor = await elderlies.find();
        const allElderly = await cursor.toArray();
        // console.log(allElderly);
        return allElderly;
    }
    catch(error){
        console.error(error);
    }
    finally{
        client.close();
    }
}

