const { MongoClient } = require('mongodb');
import { collectionIds } from '../constants/collectionsIds';
import { Elderly } from '../types/elderly';
import { config } from './config';



// export const insertSteps = async (steps: number,elderlyNum: string, googleid: string, date : Date) => {
//     const client = new MongoClient(config.database.url)
//     try {
//         await client.connect()
//         const db = client.db(config.database.name);
//         const Steps_collection = db.collection("Steps");
//         const result = {
//             "val": steps,
//             "elderlyNum":elderlyNum,
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


// export const insertHR = async (hr: number, elderlyNum: string, googleid: string, date : Date) => {
//     const client = new MongoClient(config.database.url)
//     try {
//         await client.connect()
//         const db = client.db(config.database.name);
//         const HR_collection = db.collection("HR");
//         const result = {
//             "val": hr,
//             "elderlyNum":elderlyNum,
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
            await Steps_collection.insertOne({elderlyNum:id,date: new Date(key), val: value[0].intVal});
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
            await Active_collection.insertOne({elderlyNum:id,date: date, val: value[0].intVal});
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
            await HR_collection.insertOne({elderlyNum:id,date: new Date(key), val: value[0].fpVal});
        }
    } catch (e) {
        console.error(e);
    } finally {
        client.close()
    }
}






export const getFeatureInRequestedDays = async (feature: string, elderlyNum: string, startDate: Date, endDate: Date) => {
    const client = new MongoClient(config.database.url)
    try {
        await client.connect()
        const db = client.db(config.database.name);
        const collection = db.collection(feature);
        if (startDate && endDate) {
            const query = {
              elderlyNum: elderlyNum,
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

function calculateMean(values: number[]): number {
    if (values.length === 0) {
      return 0;
    }
  
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / values.length;
    return mean;
  }

export const getFeatureInRequestedDaysCityGender = async (
    feature: string,
    city: string,
    gender: string,
    startDate: Date,
    endDate: Date
  ) => {
    const client = new MongoClient(config.database.url);
    try {
      await client.connect();
      const db = client.db(config.database.name);
      let elderlyQuery;
      const elderliesCollection = db.collection("Elderlies");
      if (city == "All"){
        elderlyQuery = {
            gender: gender
          };
      }
      else if(gender == "All"){
        console.log("in all gender");
        elderlyQuery = {
            city: city,
          };
      }
      else{
      elderlyQuery = {
        city: city,
        gender: gender
      };
    }
      const elderlyProjection = { _id: 0, elderlyNum: 1 };
      const elderlyCursor = elderliesCollection.find(elderlyQuery, elderlyProjection);
      const elderlyDocuments = await elderlyCursor.toArray();
      const matchingElderlyNums = elderlyDocuments.map((doc: { elderlyNum: string }) => doc.elderlyNum);
      console.log("matchingElderlyNums",matchingElderlyNums);
      const collection = db.collection(feature);
  
      if (startDate && endDate) {
        const query = {
          elderlyNum: { $in: matchingElderlyNums },
          date: {
            $gte: startDate,
            $lte: endDate
          }
        };
  
        const projection = { _id: 0, val: 1, date: 1 };
const cursor = collection.find(query, projection);
const documents = await cursor.toArray();

const dailyValues: { [date: string]: number[] } = {};

documents.forEach((doc: { date: Date; val: number }) => {
  const dateString = doc.date.toISOString().split('T')[0];

  if (!dailyValues[dateString]) {
    dailyValues[dateString] = [];
  }

  dailyValues[dateString].push(doc.val);
});

const result = Object.keys(dailyValues).map((date: string) => ({
  date,
  value: calculateMean(dailyValues[date]),
}));

console.log(result);
return result;
      } else {
      }
    } catch (e) {
      console.error("");
    } finally {
      client.close();
    }
  };
  
