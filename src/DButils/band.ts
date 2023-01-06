const { MongoClient } = require('mongodb');
import { config } from './config';

export const insertSleeping = async (sleeping: string,elderlyId: string, googleid: string, date : Date) => {
    const client = new MongoClient(config.database.url)
    try {
        await client.connect()
        const db = client.db(config.database.name);
        const Sleeping_collection = db.collection("Sleeping");
        const result = {
            "val": sleeping,
            "elderlyId":elderlyId,
            "googleid": googleid,
            "date": date,
        }
        await Sleeping_collection.insertOne(result);
    } catch (e) {
        console.error(e);
    } finally {
        client.close()
    }
}



export const insertSteps = async (steps: number,elderlyId: string, googleid: string, date : Date) => {
    const client = new MongoClient(config.database.url)
    try {
        await client.connect()
        const db = client.db(config.database.name);
        const Steps_collection = db.collection("Steps");
        const result = {
            "val": steps,
            "elderlyId":elderlyId,
            "googleid": googleid,
            "date": date,
        }
        await Steps_collection.insertOne(result);
    } catch (e) {
        console.error(e);
    } finally {
        client.close()
    }
}


export const insertHR = async (hr: number, elderlyId: string, googleid: string, date : Date) => {
    const client = new MongoClient(config.database.url)
    try {
        await client.connect()
        const db = client.db(config.database.name);
        const HR_collection = db.collection("HR");
        const result = {
            "val": hr,
            "elderlyId":elderlyId,
            "googleid": googleid,
            "date": date,
        }
        await HR_collection.insertOne(result);
    } catch (e) {
        console.error(e);
    } finally {
        client.close()
    }
}


export const insertLoneliness = async (loneliness: number,  elderlyId: string, googleid: string, date : Date) => {
    const client = new MongoClient(config.database.url)
    try {
        await client.connect()
        const db = client.db(config.database.name);
        const Loneliness_collection = db.collection("Loneliness");
        const result = {
            "val": loneliness,
            "elderlyId":elderlyId,
            "googleid": googleid,
            "date": date,
        }
        await Loneliness_collection.insertOne(result);
    } catch (e) {
        console.error(e);
    } finally {
        client.close()
    }
}


export const insertPhysicalCondition= async (physicalCondition : number, elderlyId: string, googleid: string, date : Date) => {
    const client = new MongoClient(config.database.url)
    try {
        await client.connect()
        const db = client.db(config.database.name);
        const physicalCondition_collection = db.collection("PhysicalCondition");
        const result = {
            "val": physicalCondition,
            "elderlyId":elderlyId,
            "googleid": googleid,
            "date": date,
        }
        await physicalCondition_collection.insertOne(result);
    } catch (e) {
        console.error(e);
    } finally {
        client.close()
    }
}

export const insertDepression= async (depression : number,  elderlyId: string, googleid: string, date : Date) => {
    const client = new MongoClient(config.database.url)
    try {
        await client.connect()
        const db = client.db(config.database.name);
        const depression_collection = db.collection("Depression");
        const result = {
            "val": depression,
            "elderlyId":elderlyId,
            "googleid": googleid,
            "date": date,
        }
        await depression_collection.insertOne(result);
    } catch (e) {
        console.error(e);
    } finally {
        client.close()
    }
}



export const getFeatureInRequestedDays = async (feature: string, elderlyId: string, startDate: Date, endDate: Date) => {
    const client = new MongoClient(config.database.url)
    try {
        await client.connect()
        const db = client.db(config.database.name);
        const collection = db.collection(feature);
        if (startDate && endDate) {
            const query = {
              elderlyId: elderlyId,
              date: {
                $gte: startDate,
                $lte: endDate
              }
            }
            const projection = { _id: 0 } 
            const cursor = collection.find(query, projection);
            const documents = await cursor.toArray();
            const result = documents.map((doc: { date: any, val: any }) => ({ [doc.date]: doc.val }))
            console.log(result);
            return result;
          }
        else{

        }

    } catch (e) {
        console.error("");
    } finally {
        client.close()
    }
}