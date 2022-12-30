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
    // console.log(code);
    const oauth2Client = new google.auth.OAuth2(
        //client id
        "59463143891-j5k7c9loabghrkdbacb92gpprfrkheed.apps.googleusercontent.com",
        //secret
        "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",
        //link to redirect to
        "http://localhost:3000/steps"
        );
    const tokens = await oauth2Client.getToken(code);
    // console.log(tokens);
    res.send("Hello");
    let stepArray = [];
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
                    startTimeMillis: 1672178400000,
                    endTimeMillis: 1672264740000,
                },
            }
        );

        // console.log(result);
        stepArray = result.data.bucket;
    }
    catch(e){
        console.log(e);
    }
    try{
        for ( const dataSet of stepArray){
            // console.log(dataSet);
            for( const points of dataSet.dataset){
                for( const steps of points.point){
                    console.log(steps.value);
                }
            }
        }
    }
    catch(e){
        console.log(e);
    }
});



export default router;

