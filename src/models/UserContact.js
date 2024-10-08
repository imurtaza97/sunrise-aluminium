import mongoose from "mongoose";

const userContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^[0-9]{10}$/.test(v); // Validate to ensure it's a 10-digit number
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    message: {
        type: String,
        required: true
    }
}, { timestamps: true });

const UserContact = mongoose.models.UserContact || mongoose.model('UserContact', userContactSchema);

export default UserContact;