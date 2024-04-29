const express = require("express");
const {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel
} = require("../controllers/hotels");

//Include other resource routers
const reservationRouter = require("./reservations");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

//re-route into other resource routers
router.use("/:hotelId/reservations/", reservationRouter);

router
  .route("/")
  .get(getHotels)
  .post(protect, authorize("admin"), createHotel);
router
  .route("/:id")
  .get(getHotel)
  .put(protect, authorize("admin"), updateHotel)
  .delete(protect, authorize("admin"), deleteHotel);

module.exports = router;
