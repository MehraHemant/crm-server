import mongoose from "mongoose";

const Contact = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    subject:{
        type: String,
                required: true,
    },
    message: {
        type: String,
    },
})

const Contact_Form = mongoose.model("Contact_Form", Contact)
export default Contact_Form;