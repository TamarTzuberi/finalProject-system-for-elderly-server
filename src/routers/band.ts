import express from "express";
const url = require('url');
const axios = require('axios');
const urlParse = require('url-parse');
const bodyParser = require('body-parser');
const request = require('request');
const router = express.Router();
const querystring = require('node:querystring');
const {google} = require("googleapis")
router.get("/getURLTINg", (req,res) => {
    const oauth2Client = new google.auth.OAuth2(
    //client id
    "59463143891-j5k7c9loabghrkdbacb92gpprfrkheed.apps.googleusercontent.com",
    //secret
    "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",
    //link to redirect to
    // "http://localhost:3000/steps"
    "http://localhost:3000/bmr"
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


// router.get("/steps", async (req,res) => {
//     const queryURL = new urlParse(req.url);
//     const code = querystring.parse(queryURL.query).code;
//     // console.log(code);
//     const oauth2Client = new google.auth.OAuth2(
//         //client id
//         "59463143891-j5k7c9loabghrkdbacb92gpprfrkheed.apps.googleusercontent.com",
//         //secret
//         "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",
//         //link to redirect to
//         "http://localhost:3000/steps"
//         );
//     const tokens = await oauth2Client.getToken(code);
//     console.log(tokens);
//     res.send("Hello");
//     let stepArray = [];
//     try{
//         const result = await axios(
//             {
//                 method: "POST",
//                 headers: {
//                 authorization: "Bearer " + tokens.tokens.access_token,
//                 },
//                 "Content-Type": "application/json",
//                 url: 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
//                 data: {
//                     aggregateBy:[
//                         {
//                             dataTypeName:"com.google.step_count.delta",
//                             dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
//                         },
//                     ],
//                     bucketByTime: { durationMillis : 86400000},
//                     // startTimeMillis: 1672178400000,
//                     startTimeMillis:1672092000000,
//                     // endTimeMillis: 1672264740000,
//                     endTimeMillis: 1672351200000,

//                 },
//             }
//         );

//         // console.log(result);
//         stepArray = result.data.bucket;
//     }
//     catch(e){
//         console.log(e);
//     }
//     try{
//         for ( const dataSet of stepArray){
//             // console.log(dataSet);
//             for( const points of dataSet.dataset){
//                 for( const steps of points.point){
//                     console.log(steps.value);
//                     res.status(200).send(steps.value);
//                 }
//             }
//         }
//     }
//     catch(e){
//         console.log(e);
//     }
// });

interface DataObject {
    [key: string]: any;
  }
  

async function getStepCounts(startTimeMillis: any, endTimeMillis: any) {
    const oauth2Client = new google.auth.OAuth2(
      "59463143891-j5k7c9loabghrkdbacb92gpprfrkheed.apps.googleusercontent.com",
      "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",
      "http://localhost:3000/steps"
    );
  
    const stepCounts: DataObject = {};
    try {
      const result = await axios({
        method: "POST",
        headers: {
          authorization: "Bearer " + 'ya29.a0AX9GBdViGsNwELNN8ddxiHa13Wh_pkJvsY3eQWpcjMebHgvHeoirOfwS69IiQL9jVVC3MtYkO_hPC273zJuQmWwAp6VOA7tdlQU0N5wCbniI4t3azenjX5gMPicZ7jXbEjoc8Jz0RfytA-GrFOlOz-NT35GnaCgYKAQUSARMSFQHUCsbCWY9QZf2Dh3diuKiUUs34fg0163',
        },
        "Content-Type": "application/json",
        url: "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
        data: {
          aggregateBy: [
            {
              dataTypeName: "com.google.step_count.delta",
              dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
            },
          ],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: startTimeMillis,
          endTimeMillis: endTimeMillis,
        },
      });
  
      for (const dataSet of result.data.bucket) {
        for (const points of dataSet.dataset) {
          for (const steps of points.point) {
            const date = new Date(steps.startTimeNanos / 1000000).toISOString().slice(0, 10);
            stepCounts[date] = steps.value;
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  
    return stepCounts;
  }

  


  async function getHeartMinutes(startTimeMillis: any, endTimeMillis: any) {
    const oauth2Client = new google.auth.OAuth2(
      "59463143891-j5k7c9loabghrkdbacb92gpprfrkheed.apps.googleusercontent.com",
      "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",
      "http://localhost:3000/heart-minutes"
    );
  
    const heartMinutes: DataObject = {
      "out-of-range": 0,
      "fat-burn": 0,
      "cardio": 0,
      "peak": 0,
    };
    try {
      const result = await axios({
        method: "POST",
        headers: {
          authorization: "Bearer " + 'ya29.a0AX9GBdW6v_YaMN74aftXEcEHEOTfKUAAUo17bEbHFQvxCc0EXi6gdM47rQ3U2uyLWv_U_l_LQuP-Koh89GO6N9jZROvNDmCt5eCni5RfrHGoDr6VtI80cSDIv1L4krt5ZjMvJf_CL80kqgRmLJ8srsXdY2KmaCgYKAScSARMSFQHUCsbCc5baq8xKxZwtm-6JHOPMog0163',
        },
        "Content-Type": "application/json",
        url: "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
        data: {
          aggregateBy: [
            {
              dataTypeName: "com.google.heart_minutes",
            },
          ],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: startTimeMillis,
          endTimeMillis: endTimeMillis,
        },
      });
  
      for (const dataSet of result.data.bucket) {
        for (const points of dataSet.dataset) {
          for (const heartMinutes of points.point) {
            for (const value of heartMinutes.value) {
              heartMinutes[value.name.replace(/[^a-zA-Z]/g, "")] += value.intVal;
            }
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  
    return heartMinutes;
  }


  


  const startTimeMillis = 1672092000000;
  const endTimeMillis = 1673301600000;

  getStepCounts(startTimeMillis, endTimeMillis)
    .then(stepCounts => {
        console.log("Steps:");
        console.log(stepCounts);
    });

    getHeartMinutes(startTimeMillis, endTimeMillis)
    .then(heartMinutes => {
        console.log("heartMinutes:");
        console.log(heartMinutes);
    });




export default router;

