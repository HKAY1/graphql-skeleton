'use strict'

const mongoose = require('mongoose');
const { Schema } = mongoose;

const basicFields = {
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
}

module.exports = basicFields;