'use strict'

const _ = require('lodash');
const mongoose = require('mongoose');

const UserModel = mongoose.model('user');
const lookup = require('models/lookup');
const OrganisationModel = mongoose.model('organisation');
const { generateJWT, checkMissingFields } = require('utils/commonFunctions');
const BaseRepo = require('app/Repositories/baseRepository');
const bcrypt = require('bcrypt');

module.exports = {
    login,
    getMyProfile,
    changePassword,
}


async function login(req, res, next) {
    const body = req.body;

    if (!body['userName']) {
        return next({ message: "userName is required", status: 400 });
    }
    if (!body['password']) {
        return next({ message: "password is required", status: 400 });
    }
    if (!body['appRole']) {
        return next({ message: "App Role is required", status: 400 });
    }

    let entityModel;
    switch (body.appRole) {
        case 'Organisation':
            entityModel = OrganisationModel;
            break;
        case 'Teacher':
            entityModel = UserModel;
            break;
        case 'Student':
            entityModel = UserModel;
            break;
        default:
            return next({ message: "Invalid App Role.", status: 400 });
    }

    try {
        const userParam = {
            searchParams: { userName: body.userName },
        }
        let user = await BaseRepo.baseDetail(entityModel, userParam);

        console.log("user is => ", user);
        if (!user) {
            return next({ message: "No one found with this phoneNumber", status: 400 });
        }

        //check for password match
        const isMatch = await user.comparePassword(body.password);

        if (!isMatch) {
            return next({ message: "Incorrect Password", status: 400 })
        }
        //check if user is blocked
        if(user.status === 'Block')
             return next({message: 'Your Account has been Blocked.'});

        //check if right app
        if (['Teacher', 'Student'].indexOf(body.appRole) !== -1 && body.appRole !== user.role) {
            return next({ message: `Cannot login with ${user.role} credentials in ${body.appRole} application.`, status: 400 });
        }
        //generate a token for the user
        const token = generateJWT({ userId: user._id, role: user.role });
        //add token to user 
        /* user.token = token;
        let updUser = await user.save(); */
        res.data = {token, ...user.toJSON() };
        return next();
    }
    catch (err) {
        console.log('Error in login : ', err);
        return next(err);
    }
}


async function getMyProfile(req, res, next) {
    try {
        console.log('user-->',req.user);
        let user = req.user;
        res.data = { ...user.toJSON(),token: req.token}
        return next();
    }
    catch (err) {
        return next(err);
    }
}

async function changePassword(req, res, next) {
    let body = req.body;
    console.log('pass body ', body);

    if (!body['newPassword']) {
        return next({ message: "New Password is missing", status: 400 });
    }
    if (!body['appRole']) {
        return next({ message: "App Role is missing", status: 400 });
    }

    body = _.pick(body, ['newPassword', 'appRole']);

    let entityModel;
    switch (body.appRole) {
        case 'Organisation':
            entityModel = OrganisationModel;
            break;
        case 'Teacher':
            entityModel = UserModel;
            break;
        case 'Student':
            entityModel = UserModel;
            break;
        default:
            return next({ message: "Invalid App Role.", status: 400 });
    }

    try {
        let user = await BaseRepo.baseDetailById(entityModel, ObjectId(req.user._id));
        if (!user) return next({ message: "User not found", status: 400 });

        const newHashedPassword = await user.encryptPassword(body.newPassword);
        //update new password
        await BaseRepo.baseUpdate(entityModel, { _id: user._id }, { password: newHashedPassword });

        res.data = { message: "Successfully updated password" };
        return next();
    }
    catch (err) {
        return next(err);
    }
}
