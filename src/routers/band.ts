import express from "express";
const url = require('url');
const axios = require('axios');
const urlParse = require('url-parse');
const bodyParser = require('body-parser');
const request = require('request');
const router = express.Router();
const querystring = require('node:querystring');
const {google} = require("googleapis")
const {updateHeartRate} = require('../handlers/healthHandlers');
const {updateActiveMintues} = require('../handlers/healthHandlers');
const {updateDistance} = require('../handlers/healthHandlers');
const {updateSpeed} = require('../handlers/healthHandlers');
const {updateSteps} = require('../handlers/healthHandlers');


function sleep(ms: number | undefined) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

router.post('/api/cookies', async (req, res) => {
  await updateHeartRate(req, res);
  await updateSteps(req,res);
  await updateActiveMintues(req,res);

});

export default router;

 