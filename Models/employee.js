import mongoose from "mongoose";

const Employee = mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['manager', 'employee'],
        required: true
    },
    admin_id: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const Emp = mongoose.model("Emp", Employee)
export default Emp;