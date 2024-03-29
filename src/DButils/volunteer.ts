import { Volunteer } from '../types/volunteer';
import { MongoClient } from "mongodb";
import { config } from "./config";
import {collectionIds} from '../constants/collectionsIds'
import { Gender } from '../types/gender';

export const getVolunteerName = async (username:string) => {
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()
		const db = client.db(config.database.name);
		const volunteerUsers = db.collection<Volunteer>(collectionIds.volunteerUsers);
		const cursor = await volunteerUsers.findOne({username});
		// const res = await cursor.next();
        // console.log(cursor?.firstName);
		return{
			firstName: cursor?.firstName,
			lastName: cursor?.lastName
		}
	}
	catch(error){
		console.error(error);
	}
	finally {
		client.close();  
	}
}

export const getVolunteerDetails = async (username:string) => {
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()
		const db = client.db(config.database.name);
		const volUsers = db.collection<Volunteer>(collectionIds.volunteerUsers);
		return await volUsers.findOne({username});
		// const res = await volUsers.findOne({volunteerUsername:username});
		// return res;
	}
    catch (error){
		console.error(error);
	}
    finally{
		client.close();
	}
}

export const insertVolunteer = async (username:string, firstName:string, lastName:string, birthYear: number, city:string, email:string,  gender:Gender, areasOfInterest:string[], languages:string[], services:string[], digitalDevices:string[], phoneNumber:string, additionalInformation:string) => {
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()
		const db = client.db(config.database.name);
		const volunteers = db.collection<Volunteer>(collectionIds.volunteerUsers);
        const existingVolunteer =await volunteers.findOne({ username: username });	
		if(existingVolunteer == undefined)
		{
			await volunteers.insertOne({
                username,
                firstName,
                lastName,
                birthYear,
                email,
                city,
                gender,
                areasOfInterest,
                languages,
                services,
                digitalDevices,
                phoneNumber,
                additionalInformation			
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

export const getAllVolunteers = async() => {
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()
		const db = client.db(config.database.name);
		const volUsers = db.collection<Volunteer>(collectionIds.volunteerUsers);
		const cursor = await volUsers.find();
        console.log(cursor.toArray());
		return cursor.toArray();
	}
	catch (error){
		console.error(error);
	}
	finally{
		client.close();
	}
}

