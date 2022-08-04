'use strict'

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ObjectId  = mongoose.Types.ObjectId;

module.exports = {
    generateJWT,
    checkMissingFields,
    removeFalseFields,
	isValidMongoObjectId,
}

function generateJWT(payload) {
	const options = {
		expiresIn: "200d"
	}
	return jwt.sign(payload, _config.jwt_secret, options);
}

function checkMissingFields(obj, fieldsList) {

	let missingFields = [];

	fieldsList.forEach(el => {
		if(!Object.keys(obj).includes(el)) missingFields.push(el);
	});

	return missingFields;

}

function removeFalseFields(obj, exceptions=[]) {
	for(let key in obj)
		if(!obj[key] && !exceptions.includes(key))
			delete obj[key]
	return obj;

}
function EpochToDate(epoch) {
    if (epoch < 10000000000)
        epoch *= 1000; // convert to milliseconds (Epoch is usually expressed in seconds, but Javascript uses Milliseconds)
    var epoch = epoch + (new Date().getTimezoneOffset() * -1); //for timeZone        
    return new Date(epoch);
}

function dateToEpoch(date){
// var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' /*,hour:'numeric',minute:'numeric',second:'numeric'*/};
	// let today = new Date();
	return Date.parse(date)/1000;
}

function isValidMongoObjectId(objId){
	console.log('objid => ', objId);
    objId = objId.toString();
	console.log('objid str => ', objId);
	return ObjectId.isValid(objId);
}