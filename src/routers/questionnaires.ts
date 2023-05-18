import * as questionnairesDB from '../DButils/questionnaires';
import express from 'express';

import * as elderly from '../DButils/elderly';

const router = express.Router();

router.get('/:frequency', async (req, res, next) => {
	try {
		const {frequency} = req.params;
		const questionnaires = await questionnairesDB.getQuestionnairesByFrequency(parseInt(frequency, 10));
		console.log(questionnaires);
		res.send((questionnaires));

	} catch (error) {
		next(error);
	}
});

router.post('/newQuestionnaires', async (req, res, next) => {
    try {
      const { body, frequency } = req.body;
      await questionnairesDB.insertQuestionnaires(body, frequency);
      res.sendStatus(201); 
    } catch (error) {
      next(error);
    }
  });

  
  








export default router;