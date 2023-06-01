import * as subjectiveDB from '../DButils/subjective';
import express from 'express';


const router = express.Router();


router.post('/newSubjectiveAns', async (req, res, next) => {
    try {
      const { answers } = req.body;
      await subjectiveDB.insertSubjectiveAns(answers);
      res.status(200).send({ success: true });
    } catch (error) {
      res.status(400).send({ success: false });
      next(error);
    }
  });

  router.get('/lastSubjectiveDate/:elderlyNum', async (req, res, next) => {
    try {
      const elderlyNum = req.params.elderlyNum;
      const LastUpdateDateSubjective = await subjectiveDB.getLastUpdateDate(elderlyNum);
      console.log("LastUpdateDateSubjective: ", LastUpdateDateSubjective);
      res.send((LastUpdateDateSubjective));
  
    } catch (error) {
      next(error);
    }
  });


export default router;