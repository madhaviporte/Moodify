const mongoose = require("mongoose");

async function connectToDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");
    } catch (err) {
        console.error("Error connecting to DB:", err.message);
        // Exit with failure so the server does not serve requests without a database
        process.exit(1);
    }
}

module.exports = connectToDB;