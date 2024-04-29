const Reservation = require("../models/Reservation");
const Hotel = require("../models/Hotel");
const Room = require("../models/Room");

//@desc     Get all reservations
//@route    GET /api/v1/reservations
//@access   Public
exports.getReservations = async (req, res, next) => {
  let query;
  //General users can see only their reservations!
  if (req.user.role === "user" ) {
    query = Reservation.find({ user: req.user.id }).populate([
    {
      path: "hotel",
      select: "name province tel picture ",
    },
    {
      path: "room",
      select: "roomtype bedtype roomcap"
    },
    {
      path: "user",
      select: "name tel"
    }
  ]);
  } else if (req.user.role === "admin") {
    if (req.params.hotelId) {
      console.log(req.params.hotelId);
      query = Reservation.find({ hotel: req.params.hotelId }).populate([
        {
          path: "hotel",
          select: "name province tel picture",
        },
        {
          path: "room",
          select: "roomtype bedtype roomcap"
        },
        {
          path: "user",
          select: "name tel"
        }
      ]);
    } else {
      query = Reservation.find().populate([
        {
          path: "hotel",
          select: "name province tel picture",
        },
        {
          path: "room",
          select: "roomtype bedtype roomcap"
        },
        {
          path: "user",
          select: "name tel"
        }
      ]);
    }
  } else if (req.user.role === "hotelmanager"){
    if (req.params.hotelId && req.params.hotelId != req.user.hotel) {
      return res
      .status(400)
      .json({ success: false, message: "You are not authorize to see the other hotel reservation" });
    } else {
      query = Reservation.find({ hotel: req.user.hotel }).populate([
        {
          path: "hotel",
          select: "name province tel picture"
        },
        {
          path: "room",
          select: "roomtype bedtype roomcap"
        },
        {
          path: "user",
          select: "name tel"
        }
      ]);
    }
  }

  try {
    const reservations = await query;

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Reservation" });
  }
};

// @desc    Get single reservation
// @route   Get /api/v1/reservations/:id
// @access  Public
exports.getReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate([
      {
        path: "hotel",
        select: "name province tel picture  paymentqr paymentname paymentnum",
      },
      {
        path: "room",
        select: "roomtype bedtype roomcap"
      },
      {
        path: "user",
        select: "name tel"
      }
    ]);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `No reservation with the id of ${req.params.id}`,
      });
    }

    res.status(200).json({ success: true, data: reservation });
  } catch (err) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Reservation" });
  }
};

// @desc    Add reservation
// @route   POST /api/v1/reservations/:hotelId/reservation
// @access  Private
exports.addReservation = async (req, res, next) => {
  try {
    req.body.hotel = req.params.hotelId;
    const hotel = await Hotel.findById(req.params.hotelId);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: `No hotel with the id of ${req.params.hotelId}`,
      });
    }

    //check room
    const room = await Room.findById(req.body.room);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: `No room with the id of ${req.body.room}`,
      });
    }

    //Add user Id to req.body
    req.body.user = req.user.id;

    //Check nightNum more than 3
    if((req.body.nightNum || 1) > 3){
      return res.status(400).json({
        success: false,
        message: `You cannot reserve more than 3 nights`,
      });
    }

    //Check for existed reservation
    const existedReservations = await Reservation.find({ user: req.user.id});

    let totalNight = 0;
    for(let reserve of existedReservations){
      if(reserve.status === "unpaid" || reserve.status === "pending" || reserve.status === "disapproved" || reserve.status === "reserved"){
        totalNight += reserve.nightNum;
      }
    }
    console.log(totalNight);

    //If the user is not an admin, they can only create 3 reservation
    if (totalNight + (req.body.nightNum || 1) > 3 &&req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: `The user with ID ${req.user.id} has already made up to 3 nights reservation`,
      });
    }

    const reservation = await Reservation.create(req.body);

    res.status(200).json({ success: true, data: reservation });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot create Reservation" });
  }
};

// @desc    Update reservation
// @route   PUT /api/v1/reservations/:id
// @access  Private
exports.updateReservation = async (req, res, next) => {
  
  try {
    let reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `No reservation with the id of ${req.params.id}`,
      });
    }

    //Make sure user is the reservation owner
    if (
      reservation.user.toString() !== req.user.id &&
      req.user.role !== "admin" && req.user.role!=='hotelmanager'
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this reservation`,
      });
    }

    //Checking nightNum
    if(reservation.nightNum!==req.body.nightNum && req.body.nightNum){
      //Check nightNum more than 3
      if((req.body.nightNum || 1) > 3){
        return res.status(400).json({
          success: false,
          message: `You cannot reserve more than 3 nights`,
        });
      }
      const existedReservations = await Reservation.find({ user: req.user.id });

      let totalNight = 0;
      for(let reserve of existedReservations){
        if(reserve.status === "unpaid" || reserve.status === "pending" || reserve.status === "disapproved" || reserve.status === "reserved"){
          totalNight += reserve.nightNum;
        }
      }
      totalNight -= reservation.nightNum;
      
      //If the user is not an admin, they can only create 3 reservation
      if (totalNight + req.body.nightNum > 3 &&req.user.role !== "admin") {
        return res.status(400).json({
          success: false,
          message: `The user with ID ${req.user.id} has already made up to 3 nights reservation`,
        });
      }
    }

    reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: reservation });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot update Reservation" });
  }
};

// @desc    Delete reservation
// @route   DELETE /api/v1/reservations/:id
// @access  Private
exports.deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `No reservation with the id of ${req.params.id}`,
      });
    }

    //Make sure user is the reservation owner
    if (
      reservation.user.toString() !== req.user.id &&
      req.user.role !== "admin" && req.user.role!=='hotelmanager'
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this reservation`,
      });
    }

    await reservation.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot delete Reservation" });
  }
};
