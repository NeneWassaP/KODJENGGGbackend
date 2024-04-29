const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    hotelid : {
        type : mongoose.Schema.ObjectId ,
        ref : "Hotel" , 
        require : true 
    } ,
    stars : {
        type : Number ,
        require : true ,
        min : 0 ,
        max : 5
    } ,
    comment : {
        type : String ,
        require : true
    } ,
    title : {
        type : String ,
        require : true 
    } ,
    userid : {
        type : mongoose.Schema.ObjectId ,
        ref : "User" ,
        require : true 
    } ,
    report : {
        type : Array ,
        default: []
    },

    service : {
        type : Boolean ,
        default : false 
    },
    food : {
        type : Boolean,
        default : false 
    },
    convenience : {
        type : Boolean,
        default : false 
    },
    cleanliness : {
        type : Boolean,
        default : false 
    },
    facility : {
        type : Boolean,
        default : false 
    },
    worthiness : {
        type : Boolean,
        default : false 
    },
    reply : {
        userreply : mongoose.Schema.ObjectId ,
        reply : String ,
        date: { type: Date }
    }
})

module.exports = mongoose.model("Review", ReviewSchema);