import * as meetingDB from '../DButils/meeting';
import express from 'express';


const router = express.Router();

router.get('/meetingsFullDetails/:username', async (req, res, next) => {
	try {
		const {username} = req.params;
		const meetings = await meetingDB.getFullElderlyMeetings(username);
		console.log(meetings);
		res.send((meetings));

	} catch (error) {
		next(error);
	}
});


export default router;