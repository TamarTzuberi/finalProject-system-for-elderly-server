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



// export const insertSteps = async (steps: number,elderlyId: string, googleid: string, date : Date) => {
//     const client = new MongoClient(config.database.url)
//     try {
//         await client.connect()
//         const db = client.db(config.database.name);
//         const Steps_collection = db.collection("Steps");
//         const result = {
//             "val": steps,
//             "elderlyId":elderlyId,
//             "googleid": googleid,
//             "date": date,
//         }
//         await Steps_collection.insertOne(result);
//     } catch (e) {
//         console.error(e);
//     } finally {
//         client.close()
//     }
// }


// export const insertHR = async (hr: number, elderlyId: string, googleid: string, date : Date) => {
//     const client = new MongoClient(config.database.url)
//     try {
//         await client.connect()
//         const db = client.db(config.database.name);
//         const HR_collection = db.collection("HR");
//         const result = {
//             "val": hr,
//             "elderlyId":elderlyId,
//             "googleid": googleid,
//             "date": date,
//         }
//         await HR_collection.insertOne(result);
//     } catch (e) {
//         console.error(e);
//     } finally {
//         client.close()
//     }
// }


export const insertSteps = async (id:string , data: Array<{ [key: string]: Array<{ intVal: number, mapVal: any[] }> }>) => {
    const client = new MongoClient(config.database.url)
    try {
        await client.connect()
        const db = client.db(config.database.name);
        const Steps_collection = db.collection("Steps");
        for (const [key, value] of Object.entries(data[0])) {
            console.log(key);
            console.log(value[0]);
            await Steps_collection.insertOne({elderlyId:id,date: new Date(key), val: value[0].intVal});
        }

    } catch (e) {
        console.error(e);
    } finally {
        client.close()
    }
}

export const insertActive = async (id:string , data: Array<{ [key: string]: Array<{ intVal: number, mapVal: any[] }> }>) => {
    const client = new MongoClient(config.database.url)
    try {
        await client.connect()
        const db = client.db(config.database.name);
        const Active_collection = db.collection("ActiveMinutes");
        for (const [key, value] of Object.entries(data[0])) {
            console.log("before change",key);
            let date = new Date(key);
            // console.log("before change in date format",key);
            // date.setDate(date.getDate() - 1);
            // console.log("after change",date);
            await Active_collection.insertOne({elderlyId:id,date: date, val: value[0].intVal});
        }

    } catch (e) {
        console.error(e);
    } finally {
        client.close()
    }
}



export const insertHR = async (id:string , data: Array<{ [key: string]: Array<{ fpVal: number, mapVal: any[] }> }>) => {
    const client = new MongoClient(config.database.url)
    try {
        await client.connect()
        const db = client.db(config.database.name);
        const HR_collection = db.collection("HR");
        for (const [key, value] of Object.entries(data[0])) {
            await HR_collection.insertOne({elderlyId:id,date: new Date(key), val: value[0].fpVal});
        }
    } catch (e) {
        console.error(e);
    } finally {
        client.close()
    }
}






export const insertLoneliness = async (id:string , data: Array<{ [key: string]: Array<{ intVal: number, mapVal: any[] }> }>) => {
    const client = new MongoClient(config.database.url)
    try {
        await client.connect()
        const db = client.db(config.database.name);
        const Loneliness_collection = db.collection("Loneliness");
        for (const [key, value] of Object.entries(data[0])) {
            let date = new Date(key);
            // date.setDate(date.getDate() + 1);
            await Loneliness_collection.insertOne({elderlyId:id,date: date, val: value[0].intVal});
        }

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
            const result = documents.map((doc: { date: any, val: any }) => ({date:doc.date, value:doc.val }))
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




export const insertDepression = async (id:string , data: Array<{ [key: string]: Array<{ intVal: number, mapVal: any[] }> }>) => {
    const client = new MongoClient(config.database.url)
    try {
        await client.connect()
        const db = client.db(config.database.name);
        const depression_collection = db.collection("Depression");
        for (const [key, value] of Object.entries(data[0])) {
            let date = new Date(key);
            // date.setDate(date.getDate() + 1);
            await depression_collection.insertOne({elderlyId:id,date: date, val: value[0].intVal});
        }

    } catch (e) {
        console.error(e);
    } finally {
        client.close()
    }
}





export const insertPhysicalCondition = async (id:string , data: Array<{ [key: string]: Array<{ intVal: number, mapVal: any[] }> }>) => {
    const client = new MongoClient(config.database.url)
    try {
        await client.connect()
        const db = client.db(config.database.name);
        const physicalCondition_collection = db.collection("PhysicalCondition"); 
        for (const [key, value] of Object.entries(data[0])) {
            let date = new Date(key);
            // date.setDate(date.getDate() + 1);
            await physicalCondition_collection.insertOne({elderlyId:id,date: date, val: value[0].intVal});
        }

    } catch (e) {
        console.error(e);
    } finally {
        client.close()
    }
}