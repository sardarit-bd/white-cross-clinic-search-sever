import { model, Schema } from "mongoose";

export const Role = {
    PATIENT: 'patient',
    DOCTOR: 'doctor',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin'
}

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    role: {
        type: String,
        default: Role.PATIENT,
    },
    verified: {
        type: Boolean,
        default: true
    },
    avatar: {
        type: String,
    },
}, {
    timestamps: true,
    versionKey: false
})

const patientSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    phoneNumber: {
        type: String,
    },
    address: {
        type: String,
    },
    country: {
        type: String,
    },
    city: {
        type: String,
    },
    phone: {
        type: String,
    },
    documents: [{
        name: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
}, {
    timestamps: true,
    versionKey: false
})

const doctorSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    phoneNumber: {
        type: String,
    },
    address: {
        type: String,
    },
    country: {
        type: String,
    },
    city: {
        type: String,
    },
    phone: {
        type: String,
    },
    documents: [{
        name: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
}, {
    timestamps: true,
    versionKey: false
})


export const User = model("User", userSchema)
export const Patient = model("Patient", patientSchema)
export const Doctor = model("Doctor", doctorSchema)