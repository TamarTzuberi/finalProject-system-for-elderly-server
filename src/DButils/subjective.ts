import { MongoClient } from "mongodb";
import { config } from "./config";



export const insertSubjectiveAns = async (answers : any) => {
	try{
        console.log("insertSubjectiveAns");
        const elderlyNum = answers.elderlyNum;
        const date = answers.date;
        const depressionVal = answers.subjective.depression;
        const lonelinessVal = answers.subjective.loneliness;
        const physicalConditionVal = answers.subjective.physicalCondition;
        const sleepingVal = answers.subjective.sleeping;
		insertPhysicalCondition(elderlyNum,date,physicalConditionVal);
        insertDepression(elderlyNum,date,depressionVal);
		insertLoneliness(elderlyNum,date,lonelinessVal);
		insertSleeping(elderlyNum,date,sleepingVal);

    }
    catch (e) {
        console.error(e);
    }
}
    
export const insertPhysicalCondition = async (id:string ,date:Date, data: number) => {
    const client = new MongoClient(config.database.url)
    try {
        await client.connect()
        const db = client.db(config.database.name);
        const physicalCondition_collection = db.collection("PhysicalCondition"); 
        await physicalCondition_collection.insertOne({elderlyNum:id, date: date, val: data});

    } catch (e) {
        console.error(e);
    } finally {
        console.log("failed to insert PhysicalCondition");
        client.close()
    }
}

export const insertDepression = async (id:string ,date:Date, data: number) => {
    const client = new MongoClient(config.database.url)
    try {
        await client.connect()
        const db = client.db(config.database.name);
        const depression_collection = db.collection("Depression");
        await depression_collection.insertOne({elderlyNum:id, date: date, val: data});

    } catch (e) {
        console.log("failed to insert Depression");
        console.error(e);
    } finally {
        client.close()
    }
}

export const insertLoneliness = async (id:string ,date:Date, data: number) => {
    const client = new MongoClient(config.database.url)
    try {
        await client.connect()
        const db = client.db(config.database.name);
        const Loneliness_collection = db.collection("Loneliness");
        await Loneliness_collection.insertOne({elderlyNum:id, date: date, val: data});

    } catch (e) {
        console.log("failed to insert Loneliness");
        console.error(e);
    } finally {
        client.close()
    }
}

export const insertSleeping = async (id:string ,date:Date, data: number) => {
    const client = new MongoClient(config.database.url)
    try {
        await client.connect()
        const db = client.db(config.database.name);
        const Sleeping_collection = db.collection("Sleeping");
        await Sleeping_collection.insertOne({elderlyNum:id, date: date, val: data});

    } catch (e) {
        console.log("failed to insert Sleeping");
        console.error(e);
    } finally {
        client.close()
    }
}