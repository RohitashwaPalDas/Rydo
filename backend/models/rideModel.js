import mongoose from 'mongoose'

const rideSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'driver',
    },
    pickup: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    fare: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        enum: [ 'pending', 'accepted', "ongoing", 'completed', 'cancelled' ],
        default: 'pending',
    },

    duration: {
        type: Number,
    }, 

    distance: {
        type: Number,
    },

    otp: {
        type: String,
        select: false,
        required: true,
    },

    paymentMethod:{type:String, required:true},
    
    payment:{type:Boolean, required:true, default:false},
})


const rideModel = mongoose.model.ride || mongoose.model("ride",rideSchema);
export default rideModel;