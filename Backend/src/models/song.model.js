const mongoose = require('mongoose');


const songSchema = new mongoose.Schema({
    url:{
        type:String,
        required: true 
    },
    posterUrl:{
        type:String,
        required: true
    },
    title:{
        type:String,
        required:true 
    },
    artist:{
        type:String,
        default: ""
    },
    album:{
        type:String,
        default: ""
    },
    mood:{
        type:String,
        enum:{
            values:["sad","happy","surprised","neutral"],
            message:"Mood must be one of: sad, happy, surprised, neutral"
        }
    }
})

const songModel = mongoose.model("songs", songSchema)

module.exports = songModel
