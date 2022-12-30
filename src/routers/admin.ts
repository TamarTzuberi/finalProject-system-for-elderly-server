import bcrypt from 'bcrypt';
import express from 'express';
// import * as responsibleDB from '../DButils/responsible';
import * as userDB from '../DButils/user';
// import * as adjustmentPercentageDB from '../DButils/adjustmentPercentage';
import { User, UserRole } from '../types/user';
// import {sendConfirmationEmail} from '../emailSender';
import {bcrypt_saltRounds} from '../constants/bycrypt'
// import { Responsible } from '../types/responsible';
const router = express.Router();


router.get('/users', async (req, res, next) => {
	try {
		const users = await userDB.getAllUsers();
		res.send(users);
	} catch (error) {
		next(error);
	}
});

export default router;