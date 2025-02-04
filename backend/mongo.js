const mongoose = require("mongoose");

// Define the schema for user data
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure email uniqueness
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String, // URL or file path to the profile image
        default: 'https://www.pphfoundation.ca/wp-content/uploads/2018/05/default-avatar.png',  // Default to an empty string or a default image URL
    },
});

// Create a model based on the schema
const User = mongoose.model("User", userSchema);

// Export the model
module.exports = User;
