const User = require("../models/User");

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, tel, email, password, role, hotel } = req.body;

    if(role==="hotelmanager"&&!hotel){
      return res
      .status(400)
      .json({ success: false, msg: "Please enter the hotel's id you manage." });
    }
    else if(role==="user"&&hotel){
      return res
      .status(400)
      .json({ success: false, msg: "User can't manage hotel." });
    }

    //Create user
    const user = await User.create({
      name,
      tel,
      email,
      password,
      role,
      hotel
    });

    //Create token
    //const token = user.getSignedJwtToken();
    //res.status(200).json({ success: true, token });
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ 
      success: false , 
      errors: err.message});
    console.log(err.stack);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
  const { email, password } = req.body;

  //Validate email & password
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, msg: "Please provide an email and password" });
  }

  //check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).json({ success: false, msg: "Invalid credentials" });
  }

  //Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({ success: false, msg: "Invalid credentisld" });
  }

  //Create token
  //const token = user.getSignedJwtToken();
  //res.status(200).json({ success: true, token });

  sendTokenResponse(user, 200, res);
  } catch(err) {
    res.status(401).json({
      success : false ,
      msg : 'Cannot convert email or password to string'
    })
  }
};

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    _id: user._id,
    name: user.name,
    email: user.email,
    token,
  });
};

// @desc    Get current Logged in uset
// @route   POST /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  let query;
  if(req.user.role==="hotelmanager"){
    query = User.findById(req.user.id).populate([
      {
        path: "hotel",
        select: "name tel",
      }
    ]);
  }
  else{
    query = User.findById(req.user.id);
  }

  try {
    const user = await query;

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find User" });
  }
};

// @desc    Log user out / clear cookie 
// @route   Get /api/v1/auth/logout
// @access  Private
exports.logout = async (req,res,next) => {
  res.cookie('token' , 'none' , {
    expires : new Date(Date.now() + 10*1000) ,
    httpOnly : true
  }) ;

  res.status(200).json({
    success : true ,
    data : {}
  }) ;
}
