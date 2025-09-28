const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  // isVerified: {
  //   type: Boolean,
  //   default: false,
  // },
  // verificationCode: {
  //   type: String,
  //   default: '',
  // },
  // resetToken: {
  //   type: String,
  //   default: '',
  // },
  // resetTokenExpiry: {   // ✅ aligned with controller
  //   type: Date,
  // },
}, {
  timestamps: true,
});

// ✅ Match password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// ✅ Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const genSalt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, genSalt);
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;