import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First name must be at least 3 characters long'],
        },
        lastname: {
            type: String,
            minlength: [3, 'Last name must be at least 3 characters long'],
        }
    },
    email: { type: String, required: true, unique: true, minlength: [3, 'First name must be at least 12 characters long'] },
    password: { type: String, required: true },
    googleAuth: { type: Boolean, default: false },
    about: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    zipcode: { type: String, default: "" },
    phone: { type: String, default: "" },
    socketId: { type: String, default: "" },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive',
    },

    vehicle: {
        color: {
            type: String,
            required: true,
            minlength: [3, 'Color must be at least 3 characters long'],
        },
        plate: {
            type: String,
            required: true,
            minlength: [3, 'Plate must be at least 3 characters long'],
        },
        capacity: {
            type: Number,
            required: true,
            min: [1, 'Capacity must be at least 1'],
        },
        vehicleType: {
            type: String,
            required: true,
            enum: ['car', 'motorcycle', 'auto'],
        }
    },

    location: {
        ltd: {
            type: Number,
        },
        lng: {
            type: Number,
        }
    },
    
    date: { type: Number, default: new Date("2025-06-20").getTime() }
});

const driverModel = mongoose.model.driver || mongoose.model("driver", driverSchema);
export default driverModel;