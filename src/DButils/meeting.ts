import { MongoClient } from "mongodb";
import { elderlyFields, meetingFields, volunteerFields } from "../constants/collections";
import { collectionIds } from "../constants/collectionsIds";
import { Meeting } from "../types/meeting";
import { config } from "./config";




export const getFullElderlyMeetings = async (username: string): Promise<Meeting[]>=> {
	const client = new MongoClient(config.database.url);
    console.log(username);
	try{
		await client.connect()

		const db = client.db(config.database.name);

		const meetings = db.collection<Meeting>(collectionIds.meetings);
        const aggregationCursor = meetings.aggregate<Meeting>([
			{ $match: { [meetingFields.elderlyUsername]: username}},
			{ $lookup:
				{
				  from: collectionIds.volunteerUsers,
				  localField: meetingFields.volunteerUsername,
				  foreignField: volunteerFields.username,
				  as: 'volunteer'
				}
			}
		]);


		return await aggregationCursor.toArray();
	}
	catch(error){
		throw(error);
	}
	finally {
		client.close();  
	}
}

export const getVolunteerMeetings = async (username: string): Promise<Meeting[]> => {
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);
		const meetings = db.collection<Meeting>(collectionIds.meetings);
		const cursor = await meetings.find({volunteerUsername: username});
		const allMeetings = await cursor.toArray();
		
        return await allMeetings;
	}
	catch(error){
		throw(error);
	}
	finally {
		client.close();  
	}
}

export const getFullVolunteerMeetings = async (username: string): Promise<Meeting[]> => {
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);

		const meetings = db.collection<Meeting>(collectionIds.meetings);
		
        const aggregationCursor = meetings.aggregate<Meeting>([
            { $match: {[meetingFields.volunteerUsername]: username} },
			{ $lookup:
				{
				  from: collectionIds.elderlyUsers,
				  localField: meetingFields.elderlyUsername,
				  foreignField: elderlyFields.username,
				  as: 'elderly'
				}
			},
			{ $lookup:
				{
				  from: collectionIds.volunteerUsers,
				  localField: meetingFields.volunteerUsername,
				  foreignField: volunteerFields.username,
				  as: 'volunteer'
				}
			},

		]);

		return await aggregationCursor.toArray();
	}
	catch(error){
		throw(error);
	}
	finally {
		client.close();  
	}
}

	

export const insertMeeting = async (volunteerUsername: string, elderlyId: string, date: Date, subject: string, duration: number) => {
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);

		const meetings = db.collection<Meeting>(collectionIds.meetings);
		const meeting = {
			volunteerUsername,
			elderlyId,
			date,
            subject,
			duration,
		}
		await meetings.insertOne(meeting);
	}
	catch(error){
		throw(error);
	}
	finally {
		client.close();  
	}
}