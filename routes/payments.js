const express = require("express");
const { cardPayment, 
    promtpayPayment , 
    webhooks,
    createPayment,
    getPayment} = require("../controllers/payment");

const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

// Route for recording expenses
router.put("/card/:id", protect, cardPayment)
      .put("/promtpay/:id", protect, promtpayPayment);
router.post("/webhook", webhooks, express.raw({ type: "application/json" }));

//Include other resource routers


router
    .route("/")
    .post(protect,createPayment)
    

router
    .route("/:id")
    .get(protect, authorize("hotelmanager"), getPayment)
module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - reservid
 *         - image
 *         - paydep
 *         - paytime
 *         - paydate
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the payment
 *         reservid:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the reservatoin
 *         image:
 *           type: string
 *           format: base64
 *         paydep:
 *           type: string
 *         paytime:
 *           type: string
 *         paydate:
 *           type: string 
 *       example:
 *         id: 662f0e455cff48483ff7f149
 *         reservid: 662f0e195cff48483ff7f10d
 *         image: data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QF8RXhpZgAATU0AKgA…
 *         deposit: 2000
 *         paytime: 10:04
 *         paydate: 2024/04/29
 */

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: The payment managing API
 */

/**
 * @swagger
 * /payment/{id}:
 *   get:
 *     summary: Get the payment by reservation id
 *     tags: [Payment]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The reservation id
 *     responses:
 *       200:
 *         description: The hospital description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       400:
 *         description: The payment was not found 
 */

/**
 * @swagger
 * /payment:
 *   post:
 *     summary: Create a new payment
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       ok:
 *         description: The payment was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       500:
 *         description: error 
 */

/**
 * @swagger
 * /payment/card/{id}:
 *   put:
 *     summary: Update the payment by the reservation id and Credit card stripe
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The reservation id
 *     responses:
 *       message:
 *          description: Checkout success
 *       400:
 *          description: Error payment
 */

/**
 * @swagger
 * /payment/promtpay/{id}:
 *   put:
 *     summary: Update the payment by the reservation id and Promtpay stripe
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The reservation id
 *     responses:
 *       message:
 *          description: Checkout success
 *       400:
 *         description: Error payment
 */
