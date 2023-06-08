import { MongoClient } from "mongodb";
 import { collectionIds } from "../constants/collectionsIds";
 import { config } from "./config";
 import { User } from '../types/user';
 const bcrypt = require('bcrypt');


 export const insertUser = async (username: string, password: string) => {
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()
		console.log('contected to mongo')
		const db = client.db(config.database.name);
		const saltRounds = 10; // number of salt rounds to use in the hashing process
		const salt = bcrypt.genSaltSync(saltRounds);
		const hashedPass = bcrypt.hashSync(password, salt);

		const existingUser =await db.collection(collectionIds.users).findOne({ username: username });	
		if(existingUser == undefined)
		{
			const newUser: User = {
				username: username,
				password: hashedPass
			};
			await db.collection(collectionIds.users).insertOne(newUser);
		
		}
		else{
			console.log("Username already exists in the system")
		}

	

	}
	catch(error){
		throw(error);
	}
	finally {
		client.close();  
	}
}
export const getAllUsers = async (): Promise<User[]> => {
	const client = new MongoClient(config.database.url);
	try {
		await client.connect()
		const db = client.db(config.database.name);
		const users = db.collection<User>(collectionIds.users);
		const cursor = users.find();
		const allUsers = await cursor.toArray();
		console.log(allUsers);
		return allUsers;
	}
	catch(error) {
		throw(error);
	}
	finally {
		client.close();  
	}
}


export const updateUserPassword = async (username: string, password: string) => {

	const client = new MongoClient(config.database.url);
	try {
		await client.connect()
		const db = client.db(config.database.name);
		const users = db.collection<User>(collectionIds.users);
		await users.updateOne({username},
			{
				'$set': {
					password
				}
			})
	}
	catch(error) {
		throw(error);
	}
	finally {
		client.close();  
	}
}
export const getUserByUsername = async (username: string): Promise<User | null> => {

	const client = new MongoClient(config.database.url);
	try {
		await client.connect()
		const db = client.db(config.database.name);
		const users = db.collection<User>(collectionIds.users);
		const user = await users.findOne({username});
		if (!user){
			return null;
		}
		return user;
	}
	catch(error) {
		throw(error);
	}
	finally {
		client.close();  
	}
}