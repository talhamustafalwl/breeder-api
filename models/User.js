const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;
const gallerySchema = mongoose.Schema(
  {
    type: String,
    filename: String,
    size: String,
    title: String,
  },
  { timestamps: true }
);

const documentsSchema = mongoose.Schema(
  {
    type: String,
    filename: String,
    size: String,
  },
  { timestamps: true }
);

const creditCardSchema = mongoose.Schema({
  name: String,
  billing_details: Object,
  card: Object,
  created: Number,
  customer: String,
  id: String,
  livemode: Boolean,
  object: String,
  type: String,
});
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      minglength: 5,
      maxlength: 50,
    },
    packageType: String,
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
    mobile: {
      type: Number,
    },
    smscode: {
      type: Number,
    },
    password: {
      type: String,
      minglength: 6,
    },
    role: {
      type: [{ type: String, enum: ["admin", "breeder", "employee"] }],
    },
    isAdmin: { type: Boolean, default: false },
    image: String,
    coverImage: String,
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
    data: Object,

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
    gallery: [gallerySchema],
    dealCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

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

    // For Employee...
    breederId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }, //belongs to which breeder
    breederUniqueId: {
      type: Number,
    },

    // For Breeder
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

    notificationSettings: {
      employeeLogin: { type: Boolean, default: true }, //breeder
      formPublish: { type: Boolean, default: true }, // breeder
      employeeRegister: { type: Boolean, default: true }, // admin/breeder
      breederRegister: { type: Boolean, default: true }, // admin
      changeSubscription: { type: Boolean, default: true }, // admin
    },

    businessInfoSettings: {
      tax: { type: Number, default: 0 },
    },
    socialLinks: {
      facebook: { type: String },
      twitter: { type: String },
      linkedin: { type: String },
      instagram: { type: String },
    },
    socialConnects: {
      facebook: { type: Object },
      twitter: { type: Object },
      linkedin: { type: Object },
      instagram: { type: Object },
    },
    deviceToken: { type: String },
    mobileToken: { type: String },
    setupWizardCompleted: {
      type: Boolean,
      default: false,
    },
    creditCard: [creditCardSchema],
    stripeCustomer: { type: Object },
    paymentInformation: {
      bankAccount: {
        bankName: String,
        accountTitle: String,
        accountNumber: String,
        routingNumber: String,
      },
      paypal: {
        id: String,
      },
      stripe: {
        id: String,
      },
    },
    activeSubscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscriber",
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    documents: [documentsSchema],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  var user = this;
  // downcase email
  user.email = this.email.toLowerCase();
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.pre("findOneAndUpdate", function (next) {
  if (this._update.password) {
    if (this._update.password.length < 30) {
      this._update.password = bcrypt.hashSync(
        this._update.password,
        saltRounds
      );
    }
  }
  next();
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  var token;
  if (user.isAdmin) {
    token = jwt.sign(user._id.toHexString(), `secret${Date.now()}`);
  } else {
    token = jwt.sign(user._id.toHexString(), "secret");
  }
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;
  var decoded = jwt.decode(token);
  user.findOne({ _id: decoded }, function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
  // jwt.verify(token, 'secret', function (err, decode) {
  //     user.findOne({ "_id": decode, "token": token }, function (err, user) {
  //         if (err) return cb(err);
  //         cb(null, user);
  //     })
  // })
};

const User = mongoose.model("User", userSchema);
module.exports = { User };
