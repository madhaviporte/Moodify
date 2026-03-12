const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true, "Username is require"],
        unique:[true, "Username must be unique"]
    },
    email:{
        type:String,
        required:[true, "Email is required"],
        unique: [true, "Email must be unique"]
    },
    password: {
      type:String,
      required:[true, "Password is required"],
      select: false
    }
})


// TASK
// userSchema.pre("save", function (next) {}) pdhni hai
// userSchema.post("save", function (next) {}) pdhni hai

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;