import { config } from "./config";
import {collectionIds} from '../constants/collectionsIds'
// import {elderlyFields} from '../constants/collections'
import { Elderly } from "../types/elderly";
// import { Meeting } from "../types/meeting";
import { FindOptions, MongoClient } from "mongodb";
import { Projection } from "../constants/mongodbCommands";
import { Gender } from '../types/gender';
// import Cookies from 'universal-cookie';
import { UsersConverter } from "../types/usersConverter";
const crypto = require('crypto');



export const insertElderly = async (elderlyNum:string ,email:string, birthYear:number, city:string, gender:Gender, firstName:string, lastName:string,password:string
   ) => {
        const uri = 'mongodb://admin:adminpassword@localhost:27017/AdminsOfElderlySystem';
        const clientAdmin = new MongoClient(uri);
        const client = new MongoClient(config.database.url);
        try{
        //     console.log("insertElderly");
        //     const adminUsername = 'admin';
        //     const adminPassword = 'adminpassword';
        //     await clientAdmin.connect();
        //     const adminDB =  clientAdmin.db(config.adminDatabase.name);
        //     console.log("connected to adminDB");
        //     const usersCollection = adminDB.collection<UsersConverter>(collectionIds.allUsersConverter);
        //     const existingUserInAdminDB =await usersCollection.findOne({ email: email });	
 
        //     if(existingUserInAdminDB == undefined)
        //     {
        //         await usersCollection.insertOne({
        //             email,
        //             elderlyNum,
        //             firstName,
        //             lastName ,
        //             password
        //         });
        //     }
        //     else{
        //         console.log("Username with this userName already exists in the adminDB")
        //     }
        console.log("the email ",email);
            const hashEmail =  convertToHashId(email);
            console.log("hash email in insert",hashEmail);
            const hashPassword = convertToHashId(password);
            await client.connect();
            console.log("conect to regular");

            const db = client.db(config.database.name);
            const elderlies = db.collection<Elderly>(collectionIds.elderlyUsers);
            const existingElderly =await elderlies.findOne({ elderlyNum: elderlyNum });	
            if(existingElderly == undefined)
            {
                await elderlies.insertOne({
                    elderlyNum,
                    hashEmail,
                    hashPassword,
                    birthYear,
                    city,
                    gender,
                });
            }
            else{
                console.log("Username already exists in the system")
            }
        }
        catch(error){
            
            console.error("in catch",error);
        }
        finally {
            client.close();  
            clientAdmin.close();
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



export const getElderyByEmail = async (email: string): Promise<Elderly | null> => {

	const client = new MongoClient(config.database.url);
	try {
        console.log("in getElderyByEmail");
		await client.connect();
		const db = client.db(config.database.name);
		const elderlies = db.collection<Elderly>(collectionIds.elderlyUsers);
        console.log("email",email);

        const hashEmail = convertToHashId(email);
        console.log("hashEmail",hashEmail);

		const elderlyUser = await elderlies.findOne({hashEmail});
		console.log("the eldery user",elderlyUser);
		return elderlyUser;
	}
	catch(error) {
		throw(error);
	}
	finally {
		client.close();  
	}
}


function convertToHashId(id : string) {
    const hash = crypto.createHash('sha256');
    hash.update(id);
    const hashVal =hash.digest('hex');
    console.log("hash is",hashVal);
    return hashVal;
  }
