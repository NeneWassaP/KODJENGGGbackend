const express = require("express");
const { register, login, getMe , logout } = require("../controllers/auth");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get('/logout' , logout) ;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - tel
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: User's name
 *         tel:
 *           type: string
 *           uniqueItems: true
 *           description: Telephone number in xxx-xxx-xxxx format
 *         email:
 *           type: string
 *           uniqueItems: true
 *           description: User's email address
 *         role:
 *           type: string
 *           enum:
 *             - user
 *             - admin
 *             - hotelmanager
 *           default: user
 *           description: User's role
 *         hotel:
 *           type: string
 *           format: ObjectId
 *           description: Reference to the associated hotel
 *         password:
 *           type: string
 *           minLength: 6
 *         resetPasswordToken:
 *           type: string
 *           description: Token used for password reset
 *         resetPasswordExpire:
 *           type: string
 *           format: date-time
 *           description: Expiration date for password reset token
 *         createAt:
 *           type: string
 *           format: date-time
 *           description: Date of user creation
 */


/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*/


/**
* @swagger
* tags:
*   name: User
*   description: The user API
*/

/**
* @swagger
* /auth/register:
*   post:
*     summary: Create a new user
*     tags: [User]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       201:
*         description: The user was successfully created
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*       500:
*         description: Some server error
*/

/**
* @swagger
* /auth/login:
*   post:
*     summary: Log-in to the system
*     tags: [User]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties: 
*               email: 
*                   type: string
*               password: 
*                   type: string
*     responses:
*       201:
*         description: Log-in Successfully
*       500:
*         description: Some server error
*/

/**
* @swagger
* /auth/me:
*   get:
*     security:
*       - bearerAuth: []
*     summary: Return information about me
*     tags: [User]
*     responses:
*       201:
*         description: My user profile
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*       500:
*         description: Some server error
*/

module.exports = router;
