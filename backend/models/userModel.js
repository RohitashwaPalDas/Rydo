import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [ 3, 'First name must be at least 3 characters long' ],
        },
        lastname: {
            type: String,
            minlength: [ 3, 'Last name must be at least 3 characters long' ],
        }
    },
    email:{type: String, required:true, unique:true, minlength: [ 3, 'First name must be at least 12 characters long' ]},
    password:{type: String, required:true},
    googleAuth: { type: Boolean, default: false },
    about: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    zipcode: { type: String, default: "" },
    phone: { type: String, default: "" },
    socketId: {type:String},
    date:{type:Number, default: new Date("2025-06-20").getTime()}
});

const userModel = mongoose.model.user || mongoose.model("user",userSchema);
export default userModel;