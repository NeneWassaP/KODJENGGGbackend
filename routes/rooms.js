const express = require("express");
const { 
  getRooms,
  dummy,
  addRoom
} = require("../controllers/rooms");

const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

router
  .route("/:id")
  .get(getRooms);

// router
//   .route("/")
//   .post(protect, authorize("admin", "hotelmanager"), addRoom);

router.route("/").post(protect, authorize("admin", "hotelmanager"), addRoom);


module.exports = router;
