import { config } from "./config";
import { collectionIds } from '../constants/collectionsIds';
import { Elderly } from "../types/elderly";
import { IntegerType, MongoClient } from "mongodb";
import { Gender } from '../types/gender';
import { UsersConverter } from "../types/usersConverter";
const crypto = require('crypto');
const createElderlyCounter = () => {
    let elderlyNum: string | undefined = undefined;
  
    return async (
      email: string,
      birthYear: number,
      city: string,
      gender: Gender,
      economy: string,
      firstName: string,
      lastName: string
    ) => {
      const uri = 'mongodb://admin:adminpassword@localhost:27017/AdminsOfElderlySystem';
      //const clientAdmin = new MongoClient(uri);
      const client = new MongoClient(config.database.url);
      try {
        console.log("the email ", email);
        const hashEmail = convertToHashId(email);
        console.log("hash email in insert", hashEmail);
        
        await client.connect();
        console.log("connect to regular");
        const db = client.db(config.database.name);
        const elderlies = db.collection<Elderly>(collectionIds.elderlyUsers);
        if (elderlyNum === undefined) {
          const lastElderly = await elderlies.findOne({}, { sort: { elderlyNum: -1 } });
          if (lastElderly) {
            elderlyNum = String(Number(lastElderly.elderlyNum) + 1);
          } else {
            elderlyNum = "1";
          }
        }
        const existingElderly = await elderlies.findOne({ hashEmail });
        if (existingElderly) {
          console.log("in existingElderly");
          return { success: false, message: "Already exists" };
        } else {
          console.log("in else");
        //   await clientAdmin.connect();
        //   console.log("after clientAdmin.connect");
        // const adminDB =  clientAdmin.db(config.adminDatabase.name);
        // console.log("connected to adminDB");
        // const usersCollection = adminDB.collection<UsersConverter>(collectionIds.allUsersConverter);
        // const existingUserInAdminDB =await usersCollection.findOne({ email: email });	

        // if(existingUserInAdminDB == undefined)
        // {
        //     await usersCollection.insertOne({
        //         email,
        //         elderlyNum,
        //         firstName,
        //         lastName ,
        //     });
        // }
        // else{
        //     console.log("Username with this userName already exists in the adminDB")
        // }
          await elderlies.insertOne({
            elderlyNum,
            hashEmail,
            birthYear,
            city,
            gender,
            economy,
          });
          elderlyNum = String(Number(elderlyNum) + 1); // Increment the static variable
          return { success: true, message: "User added to the DB" };
        }
        
  
      } catch (error) {
        return { success: false, message: "catch" };
        console.error("in catch", error);
      } finally {
        client.close();
        // clientAdmin.close();
      }
    }
  }
  
  export const insertElderly = createElderlyCounter();



export const updateElderly = async (elderlyNum:string, birthYear:number, city:string, gender:Gender, economy:string) => {
  console.log("in updateElderly");
  const client = new MongoClient(config.database.url);
  try {
    await client.connect();
    const db = client.db(config.database.name);
    const elderlies = db.collection<Elderly>(collectionIds.elderlyUsers);
    const query = { elderlyNum: elderlyNum };

    const update = { $set: { birthYear: birthYear, city: city, gender: gender, economy: economy } };
    await elderlies.updateOne(query, update);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  } finally {
    client.close();
  }
};

    
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

  export const getElderlyAns = async(elderlyNum : string) => {
    const client = new MongoClient(config.database.url)
    try {
        await client.connect()
        const db = client.db(config.database.name);
        const elderlies = db.collection<Elderly>(collectionIds.elderlyUsers);
        const query = {
            elderlyNum : elderlyNum,
        }
        const elderlyUser = await elderlies.findOne(query);
        if (elderlyUser) {
          if (elderlyUser.city === null && elderlyUser.birthYear === null && elderlyUser.gender === null && elderlyUser.economy === null) {
            return { success: false, message: "Elderly didn't answer the first questionniare" };
          } else {
            return { success: true, message: "elderly already answered the first questionniare" };
          }
        }
        else{
          console.log("Elderly doesnt exist in DB");
        }
    } catch (e) {
        console.error(e);
    } finally {
        client.close()
    }
};
