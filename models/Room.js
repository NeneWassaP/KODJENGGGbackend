const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    price : {
        type : Number ,
        require : true 
    } ,
    roomtype : {
        type : String ,
        require : true ,
        enum : 
            [
            "Deluxe Room" ,
            "Suite" ,
            "Executive Room" ,
            "Family Room" ,
            ]
    } ,
    bedtype : {
        type : String ,
        require : true ,
        enum : [
            "King Bed" ,
            "Queen Bed" ,
            "Double Bed",
            "Twin Bed",
            "Sofa Bed",
        ]
    } ,
    hotel_id : {
        type : mongoose.Schema.ObjectId ,
        ref : "Hotel" , 
        require : true 
    } ,
    roomcap : {
        type : Number ,
        require : true 

    } ,
    picture : {
        type : String ,
        require : true 
    }

})
module.exports = mongoose.model("Room", RoomSchema);