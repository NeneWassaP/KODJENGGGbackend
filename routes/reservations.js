const express = require("express");
const {
  getReservations,
  getReservation,
  addReservation,
  updateReservation,
  deleteReservation
} = require("../controllers/reservations");

const router = express.Router({ mergeParams: true });

//protect = have to login
//authorize = role check
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(protect, getReservations)
  .post(protect, authorize("admin", "user"), addReservation);
router
  .route("/:id")
  .get(protect, getReservation)
  .put(protect, authorize("admin", "user","hotelmanager"), updateReservation)
  .delete(protect, authorize("admin", "user", "hotelmanager"), deleteReservation);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       required:
 *         - revDate
 *         - user
 *         - hotel
 *         - room
 *         - totalPrice
 *       properties:
 *         id:
 *           type: String
 *           format: uuid
 *           description: The auto-generated id of the reservation
 *         revDate:
 *           type: Date
 *         nightNum:
 *           type: Number
 *         user:  
 *           type: String
 *           format: uuid
 *           description: The auto-generated id of the user
 *         hotel:
 *           type: String
 *           format: uuid
 *           description: The auto-generated id of the hotel
 *         room:
 *           type: String
 *           format: uuid
 *           description: The auto-generated id of the reservation
 *         totalPrice:
 *           type: Number
 *         createdAt:
 *           type: Date
 *         status:
 *           type: String
 *       example:
 *         id: 662ccb895b75a24a10d4fed7
 *         revDate: 2024-04-28T17:00:00.000+00:00
 *         nightNum: 1
 *         user: 6600e781f268d57e0b6a87de
 *         hotel: 6600ebf5f52ff909aed4c210
 *         room: 661acfc7c15463157a951569
 *         totalPrice: 8000
 *         status: pending
 *         sessionId: f7bbc980-0462-11ef-9d72-5db911bdfd38
 *         createdAt: 2024-04-27T06:54:18.136+00:00
 */