import { Schema, model } from "mongoose";

const filesSchema = new Schema({
    cardHolderIdentification: {
        firstName: String,
        lastName: String,
        birthDate: String
    },
    cardNumber: String,
    validFrom: String,
    validUntil: String,
    drivingLicenseNumber: String,
    installationData: {
        installedBy: String,
        installationDate: String,
        workshopCardNumber: String
    },
    vehicleRecords: [{
        vin: String,
        firstUse: String,
        lastUse: String,
        odometer: {
            start: Number,
            end: Number
        }
    }],
    activityData: [{
        date: { type: String },
        activities: [{
            start: { type: String },
            end: { type: String },
            type: { type: String }
        }],
        location: {
            start: { type: String },
            end: { type: String }
        }
    }],
    eventsAndFaults: [{
        event: { type: String },
        timestamp: { type: String }
    }],
    violations: [{
        date: { type: String },
        type: { type: String },
        limit: { type: Number },
        actual: { type: Number },
        units: { type: String }
    }],
    fileName: {
        type: String,
        required: true
    },
    uploadedAt: {
        type: Date,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
});

export default model('files', filesSchema);