const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const userRoleSchema = mongoose.Schema({
  type: { type: String, enum: ["admin", "breeder", "employee"] },
  breederUid: String,
  breederId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }, //belongs to which breeder
  name: {
    type: String,
    minglength: 5,
    maxlength: 50,
  },
  phone: {
    type: String,
    minglength: 10,
    maxlength: 15,
  },
  website: {
    type: String,
  },
  password: String,
  date: Date,
  isActive: { type: Boolean, default: true },
});

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      minglength: 5,
      maxlength: 50,
    },
    phone: {
      type: String,
      minglength: 10,
      maxlength: 15,
    },
    email: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
    },
    password: {
      type: String,
      minglength: 6,
    },
    // role: {
    //     type: [{type: String,  enum: ["admin", "breeder","employee"] }],
    // },

    role: [
      {
        type: userRoleSchema,
        set: function (role) {
          this._role = this.role;
          return role;
        },
      },
    ],

    isAdmin: { type: Boolean, default: false },
    image: String,
    token: {
      type: String,
    },
    tokenExp: {
      type: Date,
    },
    verified: { type: Boolean, default: false }, // For verification..

    active: {
      type: Boolean,
      default: true, //0 for not active,1 for active
    },

    secretToken: String, //for email confirmation
    resetToken: String, //for forget password
    //resetTokenExp:Date

    gender: {
      type: String,
      enum: ["male", "female"],
    },
    dataOfBirth: {
      type: Date,
    },

    description: {
      type: String,
    },
    city: String,
    state: String,
    zipcode: Number,
    address: String,

    // For employees need to give access rights..
    canAccessMobileApp: Boolean,
    canAccessInventoryManagement: Boolean,

    // For employees need to enter business name..
    businessName: String,
    noOfEmployees: String,
    noOfAnimals: Number,
    founded: Number,
    isEmployeeActive: {
      type: Boolean,
      default: true,
    },
    ////extra must fields for Employee
    appointmentDate: {
      type: Date,
    },
    breederId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }, //belongs to which breeder
    uid: {
      type: Number,
    },
    farmId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Farm",
      },
    ], //belongs to which farm and can be multiple farms ..
    designationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
    },
    farmName: {
      type: String,
    },
    designationName: {
      type: String,
    },
    currencyId: { type: mongoose.Schema.Types.ObjectId, ref: "Currency" },
    isblocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  var user = this;
  var oldRole = this._role;
  // downcase email
  user.email = this.email.toLowerCase();
  user.password = "";
  console.log("in save");
  if (user.isModified("role")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.role[user.role.length - 1].password, salt, function (
        err,
        hash
      ) {
        if (err) return next(err);
        user.role[user.role.length - 1].password = hash;
        next();
      });
    });
  }
  // console.log(user);
  // console.log(oldRole);
  // if (user.isModified('password')) {
  //     bcrypt.genSalt(saltRounds, function (err, salt) {
  //         if (err) return next(err);
  //         bcrypt.hash(user.password, salt, function (err, hash) {
  //             if (err) return next(err);
  //             user.password = hash
  //             next();
  //         });
  //     });
  // } else {
  //     next()
  // }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), "secret");
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;
  jwt.verify(token, "secret", function (err, decode) {
    user.findOne({ _id: decode, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);
module.exports = { User };
