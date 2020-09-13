const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    mobile: {
        type: String,
        required: true,
        maxlength: 15,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        trim: true
    },
    enterprise: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    organisation_type: {
        type: String,
        required: true,
    },
    office_address: {
        type: String,
        required: true,
        maxlength: 150,
        trim: true
    },
    office_district: {
        type: String,
        trim: true
    },
    office_pin: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true
    },
    main_business_activity: {
        type: String,
        trim: true
    },
    tems_and_cond_checkbox: {
        type: String,
        trim: true
    }


}, { timestamps: true })




module.exports = mongoose.model("User", userSchema)