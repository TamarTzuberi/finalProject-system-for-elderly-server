import { MongoClient } from "mongodb";
 import { collectionIds } from "../constants/collectionsIds";
 import { config } from "./config";
 import { User , UserRole } from '../types/user';


 export const insertUser = async (username: string, hash_password: string, role: UserRole) => {
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()
		console.log('contected to mongo')
		const db = client.db(config.database.name);
		const users = db.collection<User[]>(collectionIds.users);

		const existingUser =await db.collection(collectionIds.users).findOne({ username: username });	
		if(existingUser == undefined)
		{
			const newUser: User = {
				username,
				password: hash_password,
				role
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
		console.log(user);
		return user;
	}
	catch(error) {
		throw(error);
	}
	finally {
		client.close();  
	}
}