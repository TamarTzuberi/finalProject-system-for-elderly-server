import express from "express";
import { off } from "process";
import { insertActive, insertSteps } from "../DButils/band";
const url = require('url');
const axios = require('axios');
const urlParse = require('url-parse');
const bodyParser = require('body-parser');
const request = require('request');
const router = express.Router();
const querystring = require('node:querystring');
const {google} = require("googleapis")
const {getLastUpdateDateBand} = require('../DButils/band');
const {insertLastUpdateDateBand , insertHR} = require('../DButils/band');

interface DataObject {
    [date: string]: number;
  }
export const updateHeartRate = async (req, res) => {
    try{
    const elderlyNum = req.body.elderlyNum;
    console.log("in updateHeartRate");
    let LastUpdateDateBand = await getLastUpdateDateBand(elderlyNum,"HR");
    let startDate;
    let endDateInDate = new Date();
    endDateInDate.setDate(new Date().getDate()-1);
    endDateInDate.setHours(23,59,59,999);
    const offset = 10800000;
    endDateInDate = new Date(Date.UTC(
        endDateInDate.getUTCFullYear(),
        endDateInDate.getUTCMonth(),
        endDateInDate.getUTCDate(),
        0, 0, 0, 0));
    let endDate = endDateInDate.getTime();
    let threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(new Date().getMonth() - 2);
    threeMonthsAgo.setDate(threeMonthsAgo.getDate() -15);
    threeMonthsAgo.setHours(0);
    threeMonthsAgo.setMinutes(0);
    threeMonthsAgo.setSeconds(0);    
    if(LastUpdateDateBand == undefined)
    {
        threeMonthsAgo = new Date(Date.UTC(
            threeMonthsAgo.getUTCFullYear(),
            threeMonthsAgo.getUTCMonth(),
            threeMonthsAgo.getUTCDate(),
            0, 0, 0, 0));
        startDate = threeMonthsAgo.getTime();
    }
    else{
        
        startDate = LastUpdateDateBand.date;
        startDate = new Date(Date.UTC(
            startDate.getUTCFullYear(),
            startDate.getUTCMonth(),
            startDate.getUTCDate(),
            0, 0, 0, 0));
       

        if (startDate.getDate() == endDateInDate.getDate() )
        {
            console.log("already update the data until yesterday HR");
            return;
        }
        startDate = startDate.getTime();
        let differenceInMs = endDate - startDate;
        let months = differenceInMs / (1000 * 60 * 60 * 24 * 30.4375);
        if (months > 2.5) {
            startDate = threeMonthsAgo.getTime();
        }
        console.log("startDate from db :", startDate)
    }
    const queryURL = new urlParse(req.url);
    const code = querystring.parse(queryURL.query).code;

    const oauth2Client = new google.auth.OAuth2(
        //client id
        "59463143891-j5k7c9loabghrkdbacb92gpprfrkheed.apps.googleusercontent.com",
        //secret
        "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",
        //link to redirect to
        "https://elderyresearch.cs.bgu.ac.il/heart_rate"
    );

    const heartRateData: DataObject = {};
    try {
        console.log("req.headers.accesstoken :",req.headers.accesstoken);
        const result = await axios({
            method: "POST",
            headers: {
                authorization: "Bearer " + req.headers.accesstoken,
            },
            "Content-Type": "application/json",
            url: "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
            data: {
                aggregateBy: [
                    {
                        dataTypeName: "com.google.heart_rate.bpm",
                        // dataSourceId: "derived:com.google.heart_rate.bpm:com.google.android.gms:resting_heart_rate<-merge_heart_rate_bpm"
                    },
                ],

                bucketByTime: { durationMillis: 86400000 },
                startTimeMillis:startDate-offset,
                endTimeMillis: endDate-offset,
            },
        });
        for (const dataSet of result.data.bucket) {
          for (const points of dataSet.dataset) {
              for (const heartRate of points.point) {
                const date = new Date(heartRate.startTimeNanos / 1000000).toISOString().slice(0, 10);
                heartRateData[date] = heartRate.value;
                console.log("heartRateData[date]",heartRateData[date]);
              }
          }
      }
      console.log("heartRateData",heartRateData);
      await insertHR(elderlyNum, heartRateData);
      insertLastUpdateDateBand("HR", elderlyNum, new Date(endDate));
      console.log("heartRateData ",heartRateData);
    } catch (e) {
        console.log(e);
    }
}
    
    catch(error){
        console.log(error);

    }
};
    

export const updateSteps = async (req,res) => {
    try{

    const elderlyNum = req.body.elderlyNum;
    let LastUpdateDateBand = await getLastUpdateDateBand(elderlyNum,"Steps");
    let startDate;
    let endDateInDate = new Date();
    endDateInDate.setDate(new Date().getDate()-1);
    endDateInDate.setHours(23,59,59,999);
    const offset = 10800000;
    endDateInDate = new Date(Date.UTC(
        endDateInDate.getUTCFullYear(),
        endDateInDate.getUTCMonth(),
        endDateInDate.getUTCDate(),
        0, 0, 0, 0));
    let endDate = endDateInDate.getTime();
    let threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(new Date().getMonth() - 2);
    threeMonthsAgo.setDate(threeMonthsAgo.getDate() -15);
    threeMonthsAgo.setHours(0);
    threeMonthsAgo.setMinutes(0);
    threeMonthsAgo.setSeconds(0);    
    if(LastUpdateDateBand == undefined)
    {
        threeMonthsAgo = new Date(Date.UTC(
            threeMonthsAgo.getUTCFullYear(),
            threeMonthsAgo.getUTCMonth(),
            threeMonthsAgo.getUTCDate(),
            0, 0, 0, 0));
        startDate = threeMonthsAgo.getTime();
    }
    else{
        
        startDate = LastUpdateDateBand.date;
        startDate = new Date(Date.UTC(
            startDate.getUTCFullYear(),
            startDate.getUTCMonth(),
            startDate.getUTCDate(),
            0, 0, 0, 0));


        if (startDate.getDate() == endDateInDate.getDate() )
        {
            console.log("already update the data until yesterday STEPS");
            return;
        }
        startDate = startDate.getTime();

        let differenceInMs = endDate - startDate;
        let months = differenceInMs / (1000 * 60 * 60 * 24 * 30.4375);
        if (months > 2.5) {
            startDate = threeMonthsAgo.getTime();
        }
    }
    const queryURL = new urlParse(req.url);
    const code = querystring.parse(queryURL.query).code;
    const oauth2Client = new google.auth.OAuth2(
        //client id
        "59463143891-j5k7c9loabghrkdbacb92gpprfrkheed.apps.googleusercontent.com",
        //secret
        "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",
        //link to redirect to
        "https://elderyresearch.cs.bgu.ac.il/steps"
        );
  
    const stepData: DataObject = {};
  
    try{
        const result = await axios(
            {
                method: "POST",
                headers: {
                authorization: "Bearer " + req.headers.accesstoken ,
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
                    startTimeMillis:startDate - offset,
                    endTimeMillis: endDate - offset,
  
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
        insertSteps(elderlyNum, stepData);
        insertLastUpdateDateBand("Steps",elderlyNum, new Date(endDate));
        console.log("steps data :",stepData);
    }
    catch(e){
        console.log(e);
    }
}
catch(e){
    console.log(e);
}
  };


  export const updateActiveMintues = async (req,res) => {
    try{
    const elderlyNum = req.body.elderlyNum;
    let LastUpdateDateBand = await getLastUpdateDateBand(elderlyNum,"ActiveMinutes");
    let startDate;
    let endDateInDate = new Date();
    endDateInDate.setDate(new Date().getDate()-1);
    endDateInDate.setHours(23,59,59,999);
    const offset = 10800000;
    endDateInDate = new Date(Date.UTC(
        endDateInDate.getUTCFullYear(),
        endDateInDate.getUTCMonth(),
        endDateInDate.getUTCDate(),
        0, 0, 0, 0));
    let endDate = endDateInDate.getTime();
    let threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(new Date().getMonth() - 2);
    threeMonthsAgo.setDate(threeMonthsAgo.getDate() -15);
    threeMonthsAgo.setHours(0);
    threeMonthsAgo.setMinutes(0);
    threeMonthsAgo.setSeconds(0);    
    if(LastUpdateDateBand == undefined)
    {
        threeMonthsAgo = new Date(Date.UTC(
            threeMonthsAgo.getUTCFullYear(),
            threeMonthsAgo.getUTCMonth(),
            threeMonthsAgo.getUTCDate(),
            0, 0, 0, 0));
        startDate = threeMonthsAgo.getTime();
    }
    else{
        startDate = LastUpdateDateBand.date;
        startDate = new Date(Date.UTC(
            startDate.getUTCFullYear(),
            startDate.getUTCMonth(),
            startDate.getUTCDate(),
            0, 0, 0, 0));
        

        if (startDate.getDate() == endDateInDate.getDate() )
        {
            console.log("already update the data until yesterday ActiveMinutes");
            return;
        }
        startDate = startDate.getTime();

        let differenceInMs = endDate - startDate;
        let months = differenceInMs / (1000 * 60 * 60 * 24 * 30.4375);
        if (months > 2.5) {
            startDate = threeMonthsAgo.getTime();
        }
    }
    const queryURL = new urlParse(req.url);
    const code = querystring.parse(queryURL.query).code;
    const oauth2Client = new google.auth.OAuth2(
        //client id
        "59463143891-j5k7c9loabghrkdbacb92gpprfrkheed.apps.googleusercontent.com",
        //secret
        "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",
        //link to redirect to
        "https://elderyresearch.cs.bgu.ac.il/active_minutes"
        );
    const activeMinutesData: DataObject = {};
  
    try{
        const result = await axios(
            {
                method: "POST",
                headers: {
                authorization: "Bearer " + req.headers.accesstoken,
                },
                "Content-Type": "application/json",
  
                url: 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
                data: {
                    aggregateBy:[
                        {
                            dataTypeName:"com.google.active_minutes",
                        },
                    ],
                    bucketByTime: { durationMillis : 86400000},
                    startTimeMillis:startDate-offset,
                    endTimeMillis: endDate-offset,
  
                },
            }
        );
        for (const dataSet of result.data.bucket) {
          for (const points of dataSet.dataset) {
            for (const activeMinutes of points.point) {
              const date = new Date(activeMinutes.startTimeNanos / 1000000).toISOString().slice(0, 10);
              activeMinutesData[date] = activeMinutes.value;
            }
          }
        }
        insertActive(elderlyNum, activeMinutesData);
        insertLastUpdateDateBand("ActiveMinutes", elderlyNum, new Date(endDate));

        console.log("activeMinutesData",activeMinutesData);
    }
    catch(e){
        console.log(e);
    }
}
catch(e){
    console.log(e);
}
  };
