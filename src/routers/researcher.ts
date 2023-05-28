
import {insertUser} from '../DButils/user';
import {UserRole} from '../types/user';
import express from 'express';
import { getFeatureInRequestedDays, getFeatureInRequestedDaysCityGender } from '../DButils/band';
const router = express.Router();
const bcrypt = require('bcrypt');


router.get('/features/steps/:elderlyId/:startDate/:endDate', async(req,res,next)=>{
    try{
        const {elderlyId,startDate, endDate} = req.params;
        const stepsInRequestedDays = await getFeatureInRequestedDays("Steps",elderlyId,new Date(startDate), new Date(endDate));
        console.log(stepsInRequestedDays);
        res.status(200).send(stepsInRequestedDays);
    }catch(e){
        next(e)
    }
});


router.get('/features/:feature/:city/:gender/:economy/:startDate/:endDate', async(req,res,next)=>{
    try{
        const {feature,city,gender,economy,startDate, endDate} = req.params;
        const stepsInRequestedDays = await getFeatureInRequestedDaysCityGender(feature,city,gender,economy,new Date(startDate), new Date(endDate));
        console.log(stepsInRequestedDays);
        res.status(200).send(stepsInRequestedDays);
    }catch(e){
        next(e)
    }
});


router.get('/features/activeMinutes/:elderlyId/:startDate/:endDate', async(req,res,next)=>{
    try{
        const {elderlyId,startDate, endDate} = req.params;
        const activeMinInRequestedDays = await getFeatureInRequestedDays("ActiveMinutes",elderlyId,new Date(startDate), new Date(endDate));
        console.log(activeMinInRequestedDays);
        res.status(200).send(activeMinInRequestedDays);
    }catch(e){
        next(e)
    }
});

router.get('/features/hr/:elderlyId/:startDate/:endDate', async(req,res,next)=>{
    try{
        const {elderlyId,startDate, endDate} = req.params;
        const hrInRequestedDays = await getFeatureInRequestedDays("HR",elderlyId,new Date(startDate), new Date(endDate));
        console.log(hrInRequestedDays);
        res.status(200).send(hrInRequestedDays);
    }catch(e){
        next(e)
    }
});

router.get('/features/loneliness/:elderlyId/:startDate/:endDate', async(req,res,next)=>{
    try{
        const {elderlyId,startDate, endDate} = req.params;
        const lonelinessInRequestedDays = await getFeatureInRequestedDays("Loneliness",elderlyId,new Date(startDate), new Date(endDate));
        console.log(lonelinessInRequestedDays);
        res.status(200).send(lonelinessInRequestedDays);
    }catch(e){
        next(e)
    }
});




router.get('/features/depression/:elderlyId/:startDate/:endDate', async(req,res,next)=>{
    try{
        const {elderlyId,startDate, endDate} = req.params;
        const depressionInRequestedDays = await getFeatureInRequestedDays("Depression",elderlyId,new Date(startDate), new Date(endDate));
        console.log(depressionInRequestedDays);
        res.status(200).send(depressionInRequestedDays);
    }catch(e){
        next(e)
    }
});

router.get('/features/physicalCondition/:elderlyId/:startDate/:endDate', async(req,res,next)=>{
    try{
        const {elderlyId,startDate, endDate} = req.params;
        const pcInRequestedDays = await getFeatureInRequestedDays("PhysicalCondition",elderlyId,new Date(startDate), new Date(endDate));
        console.log(pcInRequestedDays);
        res.status(200).send(pcInRequestedDays);
    }catch(e){
        next(e)
    }
});


router.get('/features/sleep/:elderlyId/:startDate/:endDate', async(req,res,next)=>{
    try{
        const {elderlyId,startDate, endDate} = req.params;
        const pcInRequestedDays = await getFeatureInRequestedDays("Sleeping",elderlyId,new Date(startDate), new Date(endDate));
        console.log(pcInRequestedDays);
        res.status(200).send(pcInRequestedDays);
    }catch(e){
        next(e)
    }
});
export default router;