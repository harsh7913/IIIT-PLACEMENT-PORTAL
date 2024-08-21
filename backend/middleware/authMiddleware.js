import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import Recruiter from '../models/recruiterModel.js'

const protect = asyncHandler(async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id)
            next()
        } catch(error) {
            console.log(error)
            res.status(401)
            throw new Error('Not authorized, token failed')
        }
    } 
    if(!token) {
        res.status(401)
        throw new Error('Not authorized, No Student Token')
    }
})

const recruiterProtect = asyncHandler(async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.recruiter = await Recruiter.findById(decoded.id)
            next()
        } catch(error) {
            console.log(error)
            res.status(401)
            throw new Error('Not authorized, token failed')
        }
    } 
    if(!token) {
        res.status(401)
        throw new Error('Not authorized, No Recruiter Token')
    }
})

const admin = (req, res, next) => {
    if(req.user && req.user.isAdmin){
        next()
    }
    else{
        res.status(401)
        throw new Error('Not Authorized as an Admin')
    }
}

const recruiterAndAdmin = (req, res, next) => {
    if(req.recruiter || (req.user && req.user.isAdmin)){
        next()
    }
    else{
        res.status(401)
        throw new Error('Not Authorized as a Recruiter or as an Admin')
    }
}

export {protect, admin, recruiterProtect, recruiterAndAdmin}  