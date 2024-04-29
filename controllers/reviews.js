const { query } = require("express");
const Review = require('../models/Review.js') ;
const Hotel = require("../models/Hotel");

// @desc    Get all reviews
// @route   Get /api/v1/reviews
// @access  Public
exports.getReviews = async ( req, res , next ) => {
  let query ;

  //Copy req.query
const reqQuery = { ...req.query };

//Fields to exclude
const removeFields = ["select", "sort", "page", "limit"];

//Loop over remove fields and delete them from reqQuery
removeFields.forEach((param) => delete reqQuery[param]);
console.log(reqQuery);

//Create query string
let queryStr = JSON.stringify(req.query);

//Create operators ($gt, $gte, etc)
queryStr = queryStr.replace(
  /\b(gt|gte|lt|lte|in)\b/g,
  (match) => `$${match}`
);
//finding resource
query = Review.find(JSON.parse(queryStr)).populate([
  {
    path: "userid",
    select: "name"
  }
]);

//Select Fields
if (req.query.select) {
  const fields = req.query.select.split(",").join(" ");
  query = query.select(fields);
}

//Sort
query = query.sort({stars: -1});
if (req.query.sort) {
  const sortBy = req.query.sort.split(",").join(" ");
  query = query.sort(sortBy);
}


//Pagination
const page = parseInt(req.query.page, 10) || 1;
const limit = parseInt(req.query.limit, 10) || 25;
const startIndex = (page - 1) * limit;
const endIndex = page * limit;

try {
  const total = await Review.countDocuments();

  query = query.skip(startIndex).limit(limit);

  //Executing query
  const reviews = await query;
  console.log(req.query);

  //Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: reviews.length,
    pagination,
    data: reviews,
  });
} catch (err) {
  res.status(400).json({ success: false });
}
};

// @desc    Update reviews
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {

    try {
      const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!review) {
        return res.status(400).json({ success: false });
      }
      // Check if the user is the owner of the review
      if (review.userid.toString() !== req.user.id && req.user.role!=="admin") {
        return res.status(403).json({ success: false, message: "You are not authorized to update this review" });
      }
      res.status(200).json({ success: true, data: review });
    } catch (err) {
      console.log(err)
      res.status(400).json({ success: false });
    }
  };

// @desc    Update reply
// @route   PUT /api/v1/reviews/reply/:id
// @access  Private
exports.updateReply= async (req, res, next) => {
    try {
      const review = await Review.findByIdAndUpdate(req.params.id, {reply : req.body.reply }, {
        new: true,
        runValidators: true,
      });
      if (!review) {
        return res.status(400).json({ success: false });
      }
      res.status(200).json({ success: true, data: review });
    } catch (err) {
      console.log(err)
      res.status(400).json({ success: false });
    }
  };
  
// @desc    Report ++
// @route   PUT /api/v1/reviews/report/:id
// @access  Private
// @desc    Report ++
// @route   PUT /api/v1/reviews/report/:id
// @access  Private
exports.updateReport = async (req, res, next) => {

  try {
      const userId = req.user.id;

      const review = await Review.findByIdAndUpdate(
          req.params.id,
          {
            $addToSet: { report: userId } // Append user ID to reportedBy array
          },
          { new: true, runValidators: true }
      );

      if (!review) {
          return res.status(404).json({ success: false, message: 'Review not found' });
      }

      res.status(200).json({ success: true, data: review });
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.addReview = async (req,res,next) => {
try{
  const hotel = await Hotel.findById(req.body.hotelid);
  if(!hotel){
    return res.status(404).json({
      success: false,
      message: `No hotel with the id of ${req.body.hotelid}`,
    });
  }

  req.body.user = req.user.id;
  console.log(req.body);

  const review = await Review.create(req.body);
  res.status(200).json({success:true, data:review});
  
}catch(err){
  console.error(err.message);
  res.status(500).json({ success: false, message: 'Server Error' });
}
}

// exports.addReview = async (req,res,next) => {
//   try{
//     const hotel = await Hotel.findById(req.body.hotelid);
//     if(!hotel){
//       return res.status(404).json({
//         success: false,
//         message: `No hotel with the id of ${req.body.hotelid}`,
//       });
//     }

//     req.body.user = req.user.id;
//     console.log(req.body);

//     const review = await Review.create(req.body);
//     res.status(200).json({success:true, data:review});
    
//   }catch(err){
//     console.error(err.message);
//     res.status(500).json({ success: false, message: 'Server Error' });
//   }
// }

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: `No review with the id of ${req.params.id}`,
      });
    }

    //Make sure user is the review owner
    if (
      review.userid.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this review`,
      });
    }

    await review.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot delete review" });
  }
};
