const express = require("express");

const {
  getReviews ,
  updateReview ,
  updateReport ,
  updateReply,
  addReview,
  deleteReview
} = require("../controllers/reviews");

//Include other resource routers
const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(getReviews)
  .post(protect, authorize("admin", "user"), addReview);

router
    .route("/:id")
    .put(protect , authorize("user","admin") ,updateReview)
    .delete(protect, authorize("admin", "user"), deleteReview);
router
    .route("/reply/:id")
    .put(protect, authorize("hotelmanager"), updateReply)
router
    .route("/report/:id")
    .put(protect , authorize("user") , updateReport)

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - hotelid
 *         - stars
 *         - comment
 *         - title
 *         - userid
 *       properties:
 *         hotelid:
 *           type: string
 *           format: ObjectId
 *         stars:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *         comment:
 *           type: string
 *         title:
 *           type: string
 *         userid:
 *           type: string
 *           format: ObjectId
 *         report:
 *           type: array
 *         service:
 *           type: boolean
 *           default: false
 *         food:
 *           type: boolean
 *           default: false
 *         convenience:
 *           type: boolean
 *           default: false
 *         cleanliness:
 *           type: boolean
 *           default: false
 *         facility:
 *           type: boolean
 *           default: false
 *         worthiness:
 *           type: boolean
 *           default: false
 *         reply:
 *           type: object
 *           properties:
 *             userreply:
 *               type: string
 *               format: ObjectId
 *             reply:
 *               type: string
 *             date:
 *               type: string
 *               format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Reviews
 */

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     responses:
 *       '200':
 *         description: A list of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *   post:
 *     summary: Add a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       '200':
 *         description: New review added successfully
 */

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       '200':
 *         description: Review updated successfully
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       '200':
 *         description: Review deleted successfully
 */

/**
 * @swagger
 * /reviews/reply/{id}:
 *   put:
 *     summary: Update reply to a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reply:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Reply updated successfully
 */

/**
 * @swagger
 * /reviews/report/{id}:
 *   put:
 *     summary: Report a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       '200':
 *         description: Review reported successfully
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Add a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       '200':
 *         description: New review added successfully
 */

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       '200':
 *         description: Review deleted successfully
 */