import * as meetingDB from '../DButils/meeting';
import express from 'express';

import * as elderly from '../DButils/elderly';

import bcrypt from 'bcrypt';

const router = express.Router();

// router.get('/meetingsFullDetails/:elderlyId', async (req, res, next) => {
// 	try {
// 		const {elderlyId} = req.params;
// 		const meetings = await meetingDB.getFullElderlyMeetings(elderlyId);
// 		console.log(meetings);
// 		res.send((meetings));

// 	} catch (error) {
// 		next(error);
// 	}
// });




router.get('/allElderlyUsers', async (req, res, next) => {
	try {
		const users = await elderly.getElderlyUsers();
		console.log(users);
		res.send((users));

	} catch (error) {
		next(error);
	}
});



router.post('/login', async (req, res, next) => {
	try {
		console.log("in login elderly");
		const {email} = req.body.email;
		console.log(email);
		// check that email exists
		const elderlyUser = await elderly.getElderyByEmail(email);
		if (!elderlyUser) {
			res.status(401).send(false);
			return;
		}
		res.status(200).send(true);
	}
	catch (error) {
		next(error);
		console.log(error);
		res.status(401).send({message: 'login failed' , success: false});
	}
});


export default router;