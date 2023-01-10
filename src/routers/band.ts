import express from "express";
const url = require('url');
const axios = require('axios');
const urlParse = require('url-parse');
const bodyParser = require('body-parser');
const request = require('request');
const router = express.Router();
const querystring = require('node:querystring');
const {google} = require("googleapis")

interface DataObject {
  [date: string]: number;
}


router.get("/getSteps", (req,res) => {
    const oauth2Client = new google.auth.OAuth2(
    //client id
    "59463143891-j5k7c9loabghrkdbacb92gpprfrkheed.apps.googleusercontent.com",
    //secret
    "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",
    //link to redirect to
    "http://localhost:3000/steps"
    )

const scopes = ["https://www.googleapis.com/auth/fitness.activity.read profile email openid"]

const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    state: JSON.stringify({
        callbackUrl: req.body.callbackUrl,
        userID: req.body.userid
    })
})
request(url, (err: any,response: any, body: any) => {
    console.log("error: ", err);
    console.log("response: ", response && response.statusCode);
    res.send({url})
})
});


router.get("/steps", async (req,res) => {
  const queryURL = new urlParse(req.url);
  const code = querystring.parse(queryURL.query).code;
  const oauth2Client = new google.auth.OAuth2(
      //client id
      "59463143891-j5k7c9loabghrkdbacb92gpprfrkheed.apps.googleusercontent.com",
      //secret
      "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",
      //link to redirect to
      "http://localhost:3000/steps"
      );
  const tokens = await oauth2Client.getToken(code);
  const stepData: DataObject = {};

  try{
      const result = await axios(
          {
              method: "POST",
              headers: {
              authorization: "Bearer " + tokens.tokens.access_token,
              },
              "Content-Type": "application/json",
              url: 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
              data: {
                  aggregateBy:[
                      {
                          dataTypeName:"com.google.step_count.delta",
                          dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
                      },
                  ],
                  bucketByTime: { durationMillis : 86400000},
                  // startTimeMillis: 1672178400000,
                  startTimeMillis:1672092000000,
                  // endTimeMillis: 1672264740000,
                  endTimeMillis: 1673301600000,

              },
          }
      );
      for (const dataSet of result.data.bucket) {
        for (const points of dataSet.dataset) {
          for (const steps of points.point) {
            const date = new Date(steps.startTimeNanos / 1000000).toISOString().slice(0, 10);
            stepData[date] = steps.value;
          }
        }
      }
      console.log(stepData);
      res.status(200).send(stepData);
  }
  catch(e){
      console.log(e);
  }
});

router.get("/getHeartRate", (req,res) => {
    const oauth2Client = new google.auth.OAuth2(
    //client id
    "59463143891-j5k7c9loabghrkdbacb92gpprfrkheed.apps.googleusercontent.com",
    //secret
    "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",
    //link to redirect to
    "http://localhost:3000/heart_rate"
    )

const scopes = ["https://www.googleapis.com/auth/fitness.heart_rate.read profile email openid"]

const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    state: JSON.stringify({
        callbackUrl: req.body.callbackUrl,
        userID: req.body.userid
    })
})
request(url, (err: any,response: any, body: any) => {
    console.log("error: ", err);
    console.log("response: ", response && response.statusCode);
    res.send({url})
})
});

router.get("/heart_rate", async (req, res) => {
    const queryURL = new urlParse(req.url);
    const code = querystring.parse(queryURL.query).code;

    const oauth2Client = new google.auth.OAuth2(
        //client id
        "59463143891-j5k7c9loabghrkdbacb92gpprfrkheed.apps.googleusercontent.com",
        //secret
        "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",
        //link to redirect to
        "http://localhost:3000/heart_rate"
    );

    const tokens = await oauth2Client.getToken(code);

    const heartRateData: DataObject = {};

    try {
        const result = await axios({
            method: "POST",
            headers: {
                authorization: "Bearer " + tokens.tokens.access_token,
            },
            "Content-Type": "application/json",
            url: "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
            data: {
                aggregateBy: [
                    {
                        dataTypeName: "com.google.heart_rate.bpm",
                        // dataSourceId: "derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm"
                        dataSourceId: "derived:com.google.heart_rate.bpm:com.google.android.gms:resting_heart_rate<-merge_heart_rate_bpm"
                    },
                ],

                bucketByTime: { durationMillis: 86400000 },
                startTimeMillis:1672092000000,
                endTimeMillis: 1673301600000,
            },
        });
        for (const dataSet of result.data.bucket) {
          for (const points of dataSet.dataset) {
              for (const heartRate of points.point) {
                const date = new Date(heartRate.startTimeNanos / 1000000).toISOString().slice(0, 10);
                heartRateData[date] = heartRate.value;
              }
          }
      }
      console.log(heartRateData);
      res.status(200).send(heartRateData);
    } catch (e) {
        console.log(e);
    }
});

export default router;

