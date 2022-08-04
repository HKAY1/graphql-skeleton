'use strict'

const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema;

const lookup = require('models/lookup'); 
const bcrypt = require('bcrypt');

const fields = {
    userName: {
        type: String,
        required: true,
      },
    organisationId:{
        type: ObjectId,
        ref: 'organisation',
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    lectureIds:{
        type: [ObjectId],
        ref: 'lecture',
        required: true
    },
    password: {
        type: String,
        required: true,
        // select: false
    },
    email: {
        type: String,
        validate: {
            validator: function (v) {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        },
        required: true
    },
    phoneNumber: {
        type: String,
        validate: {
            validator: function (v) {
                return /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: true
    },
    address: {
       type: String,
       default: ""
    },
    gender: {
        type: String,
        enum: lookup.genders,
        required: true
    },
    role: {
        type: String,
        enum: lookup.userRoles,
        required: true
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    imageUrl: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: lookup.accountStatus,
        default: lookup.accountStatus[0]
    }

};


const schema = require('utils/generate-schema')(fields,true);

/* Schema methods */
schema.methods.encryptPassword = function (password){
    return bcrypt.hashSync(password, 10);
}

schema.methods.comparePassword = function (password){
    return bcrypt.compareSync(password, this.password);
}

schema.pre('save', function(next) {
    let user = this;
     // only hash the password if it has been modified (or is new)
     if (!user.isModified('password')) return next();

     // generate a salt
     bcrypt.genSalt(10, function(err, salt) {
         if (err) return next(err);
 
         // hash the password using our new salt
         bcrypt.hash(user.password, salt, function(err, hash) {
             if (err) return next(err);
             // override the cleartext password with the hashed one
             user.password = hash;
             next();
         });
     });
  });

/* indexes */
// schema.index({email: 1}, {unique: true});
schema.index({userName: 1}, {unique: true});


module.exports = mongoose.model('user', schema);


