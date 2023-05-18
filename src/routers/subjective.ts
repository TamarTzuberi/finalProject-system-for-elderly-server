import * as subjectiveDB from '../DButils/subjective';
import express from 'express';


const router = express.Router();


router.post('/newSubjectiveAns', async (req, res, next) => {
    try {
      const { answers } = req.body;
      await subjectiveDB.insertSubjectiveAns(answers);
      res.sendStatus(201); 
    } catch (error) {
      next(error);
    }
  });


export default router;