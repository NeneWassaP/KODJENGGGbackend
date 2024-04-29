const { query } = require("express");
const Room = require("../models/Room");
const Hotel = require("../models/Hotel");

exports.getRooms = async (req, res, next) => {
  let query;

  if(req.params.id) {
    console.log(req.params.id);
    query = Room.find({ hotel_id: req.params.id })
  }

  try {
    const room = await query;
    res.status(200).json({
      success: true,
      count: room.length,
      data: room,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Room" });
  }
};


// @desc    Add room
// @route   POST /api/v1/rooms
// @access  Private
exports.addRoom = async (req,res,next) => {
  try{
    const hotel = await Hotel.findById(req.body.hotel_id);
    if(!hotel){
      return res.status(404).json({
        success: false,
        message: `No hotel with the id of ${req.body.hotelid}`,
      });
    }
  
    req.body.user = req.user.id;
    console.log(req.body);
  
    const room = await Room.create(req.body);
    res.status(200).json({success:true, data:room});
    
  }catch(err){
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
  }