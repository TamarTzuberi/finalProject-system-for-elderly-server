import * as meetingDB from '../DButils/meeting';
import express from 'express';

import * as elderly from '../DButils/elderly';


const router = express.Router();

router.get('/meetingsFullDetails/:elderlyId', async (req, res, next) => {
	try {
		const {elderlyId} = req.params;
		const meetings = await meetingDB.getFullElderlyMeetings(elderlyId);
		console.log(meetings);
		res.send((meetings));

	} catch (error) {
		next(error);
	}
});


router.get('/allElderlyUsers', async (req, res, next) => {
	try {
		const users = await elderly.getElderlyUsers();
		console.log(users);
		res.send((users));

	} catch (error) {
		next(error);
	}
});


export default router;