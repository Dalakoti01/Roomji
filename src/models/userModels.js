import mongoose, { Schema } from "mongoose";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 35,
    },
    password: {
      type: String,
      required: true,
      min: 4,
    },
    uniqueId: { type: String, unique: true, default: () => "USR" + nanoid() },
    email: {
      type: String,
      required: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      unique: true,
    },
    recoveryEmail: {
      type: String,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phoneNumber: {
      type: String,
      required: true,
      set: (v) => String(v).replace(/\s+/g, "").trim(), // strip spaces
      match: [/^\+?[0-9]{10,15}$/, "Please enter a valid phone number"],
    },
    phoneNumberShow: {
      type: Boolean,
      default: true,
    },
    whatsappNumber: {
      type: String,
      set: (v) => String(v).replace(/\s+/g, "").trim(), // strip spaces
      match: [/^\+?[0-9]{10,15}$/, "Please enter a valid phone number"],
    },
    whatsappNumberShow: {
      type: Boolean,
      default: true,
    },
    profilePhoto: {
      type: String,
    },

    coverPhoto: {
      type: String,
    },
    propertySubscription: {
      isActive: {
        type: Boolean,
        default: false,
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
    },

    totalService : {
      type : Number,
      default : 0,
    },
    totalProperties : {
      type : Number,
      default : 0,
    },

    serviceSubscription: {
      isActive: {
        type: Boolean,
        default: false,
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
    },

    freeTrial: {
        isActive : {
          type : Boolean,
          default : false
        },
        startDate : {
          type : Date,

        },
        endDate : {
          type : Date
        },
        oneTimeDone : {
          type : Boolean,
          default : false
        }
    },
    userAddress: {
      type: String,
    },
    overallratings: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        rating: {
          type: Number,
        },
        feedback: {
          type: String,
        },
        feedbackDate: {
          type: Date,
        },
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    feedbackToPlatform: [
      {
        fullName: {
          type: String,
        },
        email: {
          type: String,
        },
        feedback: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        isRead: {
          type: Boolean,
          default: false,
        },
      },
    ],
    adminSupportMessages: [
      {
        message: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        firstName: {
          type: String,
        },
        lastName: {
          type: String,
        },
        email: {
          type: String,
        },
        replyByAdmin: {
          type: Boolean,
          default: false,
        },
      },
    ],
    verified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: Number,
    },
    otpExpire: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    socialLinks: {
      instagram: {
        type: String,
      },
      facebook: {
        type: String,
      },
      twitter: {
        type: String,
      },
      linkedIn: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
