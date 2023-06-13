import { config } from "./config";
import { collectionIds } from '../constants/collectionsIds';
import { Elderly } from "../types/elderly";
import { FirstLogin } from "../types/firstLogin";

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
      economicState: string,
      familyStatus: string,
      longTermIllness: string,
      disability: string,
    ) => {

      const uri = 'mongodb://researcherUserAdmin:researcherPasswordAdmin@127.0.0.1:27017/adminDB';
      const clientAdmin = new MongoClient(uri);
      const client = new MongoClient(config.database.url);
      try {
        console.log("the email ", email);
        const hashEmail = convertToHashId(email);
        console.log("hash email in insert", hashEmail);
        await client.connect();
        console.log("connect to regular db");
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
          console.log("there is no existingElderly");
          await elderlies.insertOne({
            elderlyNum,
            hashEmail,
            birthYear,
            city,
            gender,
            economicState,
            familyStatus,
            longTermIllness,
            disability,
          });
          client.close();
          try{
              await clientAdmin.connect();
              console.log("after clientAdmin.connect");
              const adminDB =  clientAdmin.db(config.adminDatabase.name);
              console.log("connected to adminDB");
              const usersCollection = adminDB.collection<UsersConverter>(collectionIds.allUsersConverter);
              const existingUserInAdminDB =await usersCollection.findOne({ email: email });	
              console.log("existingUserInAdminDB :",existingUserInAdminDB);
              if(existingUserInAdminDB == undefined)
              {
                  await usersCollection.insertOne({
                      email,
                      elderlyNum,
                  });
              }
              else{
                  console.log("Username with this email already exists in the adminDB")
              }

            clientAdmin.close();
            elderlyNum = String(Number(elderlyNum) + 1); // Increment the static variable

          }
          catch(error){
            console.error("in catch", error);
            clientAdmin.close();
            return { success: false, message: "catch" };
          }
          return { success: true, message: "User added to the DB" };
        }
        
      } catch (error) {
        client.close();
        console.error("in catch", error);
        return { success: false, message: "catch" };
      }
      
    }
  }
  
  export const insertElderly = createElderlyCounter();



export const updateElderly = async (answers: any) => {
  const elderlyNum = answers.elderlyNum;
  const birthYear = answers.personalDetails.birthYear;
  const city = answers.personalDetails.city;
  const gender = answers.personalDetails.gender;
  const economicState = answers.personalDetails.economicState;
  const familyStatus = answers.personalDetails.familyStatus;
  const longTermIllness = answers.personalDetails.longTermIllness;
  const disability = answers.personalDetails.disability;
  console.log("in updateElderly");
  const client = new MongoClient(config.database.url);
  try {
    await client.connect();
    const db = client.db(config.database.name);
    const elderlies = db.collection<Elderly>(collectionIds.elderlyUsers);
    const query = { elderlyNum: elderlyNum };

    const update = { $set: { birthYear: birthYear, city: city, gender: gender, economicState: economicState , familyStatus:familyStatus, longTermIllness:longTermIllness, disability:disability} };
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
          if (elderlyUser.city === null && elderlyUser.birthYear === null && elderlyUser.gender === null && elderlyUser.economicState === null) {
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


export const getFirstLogin = async(deviceToken : string) => {
  const client = new MongoClient(config.database.url)
  try {
      await client.connect()
      const db = client.db(config.database.name);
      const firstLogin = db.collection<FirstLogin>("FirstLogin");
      const query = {
        deviceToken : deviceToken,
      }
      const elderlyUser = await firstLogin.findOne(query);
      if (elderlyUser) {
        console.log("in exist")
        return true;
      }
      else{
        await firstLogin.insertOne({
          deviceToken,
          firstLogin : true,
        });
        return false;      
      }
  } catch (e) {
      console.error(e);
  } finally {
      client.close()
  }
};

