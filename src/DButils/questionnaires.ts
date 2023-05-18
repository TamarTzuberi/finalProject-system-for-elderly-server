import { MongoClient } from "mongodb";
import { collectionIds } from "../constants/collectionsIds";
import { Questionnaires } from "../types/questionnaires";
import { config } from "./config";



export const insertQuestionnaires = async (body: string[], frequency: number) => {
	const client = new MongoClient(config.database.url);
	try{
        console.log("insertQuestionnaires");
		await client.connect()

		const db = client.db(config.database.name);

		const questionnaires = db.collection<Questionnaires>(collectionIds.questionnaires);
        const existingFrequency = await questionnaires.findOne({ frequency });
        if (!existingFrequency)
        {
        console.log("!existingFrequency");
		const newQuestionnaires = {
			body,
			frequency,

		}
		await questionnaires.insertOne(newQuestionnaires);
	    }
        else{
        console.log("in update");

        const updatedQuestionnaire = await questionnaires.findOneAndUpdate(
            { frequency },
            { $set: { body: body } },
            { returnDocument: "after" }
            );
        }
    
    }

	catch(error){
		throw(error);
	}
	finally {
		client.close();  
	}
}


export const getQuestionnairesByFrequency = async (frequency: number): Promise<Questionnaires[]>=> {
	const client = new MongoClient(config.database.url);
    console.log(frequency);
	try{
		await client.connect()

		const db = client.db(config.database.name);

		const questionnaires = db.collection<Questionnaires>(collectionIds.questionnaires);
        const aggregationCursor = questionnaires.aggregate<Questionnaires>([
			{ $match: { ['frequency']: frequency}},
		
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

