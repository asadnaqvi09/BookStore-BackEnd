const User = require("../models/userModel");
const { validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const {
  isEmailValid,
  isStrongPassword,
  isDisposableEmail,
} = require("../utilis/validator");
const generateToken = require('../utilis/generateToken');

const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { userName, email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) throw new Error("User already exists");

    if (!userName || !email || !password) {
      throw new Error("Please fill all fields");
    }

    const checkValidation =
      isEmailValid(email) &&
      isStrongPassword(password) &&
      !isDisposableEmail(email);

    if (!checkValidation) {
      throw new Error(
        "Please provide a valid email address, strong password, and non-disposable email"
      );
    }

    const user = await User.create({ userName, email, password });

    generateToken(res,user);
    // const code = crypto.randomBytes(3).toString("hex");
    // user.verificationCode = code;

    // await sendVerificationEmail(email, code);

    res.status(201).json({
      message: "User registered Successfully",
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// const verifyCode = [
//   [
//     body("email").isEmail(),
//     body("code").notEmpty(),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { email, code } = req.body;
//     const user = await User.findOne({ email });
//     if (!user || user.verificationCode !== code) {
//       return res.status(400).json({ error: "Invalid code" });
//     }

//     user.isVerified = true;
//     user.verificationCode = undefined;
//     await user.save();

//     res.json({ accessToken, refreshToken, message: "Account verified" });
//   },
// ];

const LoginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      throw new Error("Please provide email and password");

    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    if (!(await user.matchPassword(password)))
      return res.status(401).json({ error: "Invalid credentials" });
    
    generateToken(res,user);

    res.status(200).json({
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// const refreshToken = async (req, res) => {
//   const { refreshToken } = req.body;
//   if (!refreshToken)
//     return res.status(401).json({ error: "Refresh token required" });

//   try {
//     const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
//     const user = await User.findById(decoded.id);
//     if (!user) return res.status(401).json({ error: "Invalid refresh token" });

//     const accessToken = generateToken(res, user);
//     res.json({ accessToken });
//   } catch (err) {
//     res.status(401).json({ error: "Invalid refresh token" });
//   }
// };

// const forgotPassword = [
//   body("email").isEmail(),
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { email } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const token = crypto.randomBytes(20).toString("hex");
//     user.resetToken = token;
//     user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
//     await user.save();

//     await sendResetEmail(email, token);

//     res.json({ message: "Reset token sent to email" });
//   },
// ];

// const resetPassword = [
//   body("token").notEmpty(),
//   body("newPassword")
//     .isStrongPassword({
//       minLength: 8,
//       minLowercase: 1,
//       minUppercase: 1,
//       minNumbers: 1,
//       minSymbols: 1,
//     }),
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { token, newPassword } = req.body;
//     const user = await User.findOne({
//       resetToken: token,
//       resetTokenExpiry: { $gt: Date.now() },
//     });

//     if (!user) return res.status(400).json({ error: "Invalid or expired token" });

//     user.password = newPassword;
//     user.resetToken = undefined;
//     user.resetTokenExpiry = undefined;
//     await user.save();

//     res.json({ message: "Password reset successful" });
//   },
// ];

const LogoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "User Logged Out" });
});

module.exports = { registerUser, LoginUser, LogoutUser };