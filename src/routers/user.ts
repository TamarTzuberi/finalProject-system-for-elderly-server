import express from 'express';
import bcrypt from 'bcrypt';
import * as userDB from '../DButils/user';
// import { sendForgotPasswordEmail} from '../emailSender';
import {bcrypt_saltRounds} from '../constants/bycrypt'
const router = express.Router();

router.post('/login', async (req, res, next) => {
	try {
		console.log("in login");
		const {username, password} = req.body;
		console.log(username);
		// check that username exists
		const user = await userDB.getUserByUsername(username);
		if (user == null){
			res.send({message: 'username does not exist' , success: false});
			return;
		}
		else{
			if (!bcrypt.compareSync(password, user.password)){
				res.send({message: 'wrong password' , success: false});
				return;
			}
			else{
				res.status(200).send({message: 'login succedded' , success: true});
				return;
			}
		} 
	}
	catch (error) {
		next(error);
		console.log(error);
		res.status(401).send({message: 'login failed' , success: false});
	}
});

router.post('/activate/:username/:password', async (req, res, next) => {
	try {
		//the password is hashed
		let {username, password} = req.params;
		username = username.substring(9, username.length);
		password = password.substring(9, password.length);

		console.log('username ' + username);
		console.log('password ' + password);

		const user = await userDB.getUserByUsername(username);
		console.log(user);
		// check that username exists
		// check that the password is correct
		if (!user || !bcrypt.compareSync(password, user.password)) {
			res.status(401).send('Username or Password incorrect');
			return;
		}
		res.status(200).send({user: user, message: 'login succeeded', success: true});
	}
	catch (error) {
		next(error);
		console.log(error);
		// res.status(401).send({message: error.message, success: false});
	}
});

router.post('/forgot-password/:username/:email', async (req, res, next) => {
	try {
		let {username, email} = req.params;
		username = username.substring(9, username.length);
		email = email.substring(9, email.length);

		// check that username exists
		const user = await userDB.getUserByUsername(username);
		if (!user) {
			res.status(401).send('UserName incorrect');
			return;
		}

		// await sendForgotPasswordEmail(username, email);
		res.status(200).send({message: 'user exists', success: true});
	}
	catch (error) {
		next(error);
		console.log(error);
		res.status(401).send({message: "unauthorized", success: false});
	}
});

router.put('/updatePassword', async (req, res, next) => {
	try {
		console.log('updatePassword');
		const {username, newPassword} = req.body;
		console.log(username);
		console.log(newPassword);
		const hashPassword = bcrypt.hashSync(newPassword, parseInt(bcrypt_saltRounds));
		await userDB.updateUserPassword(username, hashPassword);
		res.status(200).send({message: 'update password succeeded', success: true});
	}
	catch (error) {
		next(error);
		console.log(error);
		res.status(401).send({message: "unauthorized", success: false});
	}
});


export default router;
