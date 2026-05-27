const mongoose = require("mongoose");


const songSchema = new mongoose.Schema({
    url:{
        type:String,
        required:true
    },
    posterUrl:{
        type:String,
        required:true,
        default: "https://www.fantastick.in/cdn/shop/files/CAMB011.jpg?v=1695123269&width=1946"
    },
    title:{
        type:String,
        required:true
    },
    mood:{
        type:String,
        enum:{
            values:["sad", "happy", "normal"],
            message: "Mood must be sad, happy, or normal"
        }
    }
})

const songModel = mongoose.model("songs",songSchema);

module.exports = songModel