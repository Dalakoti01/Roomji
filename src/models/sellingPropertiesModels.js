import mongoose, { Schema } from "mongoose";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

const sellingPropertiesSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: { type: String },
    uniqueId: { type: String, unique: true, default: () => "AM" + nanoid() },
    owner: {
      fullName: {
        type: String,
      },
      email: {
        type: String,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
      phoneNumber: {
        type: String,
        required: true,
        set: (v) => String(v).replace(/\s+/g, "").trim(), // strip spaces
        match: [/^\+?[0-9]{10,15}$/, "Please enter a valid phone number"],
      },

      showPhoneNumber: { type: Boolean, default: false },

      uniqueId: {
        type: String,
      },

      profession: {
        type: String,
      },
      personalNote: {
        type: String,
      },
    },

    propertyTypes: {
      type: String,
      enum: ["PG", "Room", "Villa", "Apartment", "House", "Hostel"],
    },

    address: {
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      detailedAddress: {
        type: String,
      },
      googleLocation: {
        lat: Number, // ✅ store Google Maps latitude
        lng: Number, // ✅ store Google Maps longitude
        placeId: String, // ✅ optional: useful for Google Maps links
      },
    },

    isPublic: {
      type: Boolean,
      default: true,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    amenities: [{ type: String }],

    uniqueCode: {
      type: String,
      required: true,
    },
    policies: [{ type: String }],

    price: {
      type: String,
    },
    area: {
      type: String,
    },

    securityDeposit: {
      type: String,
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
    reports: [
      {
        reportedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        reason: {
          type: String,
        },
        reportDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    reportStatus : {
      type: String,
      enum: ["Pending", "Reviewed", "Action Taken","Not Reported"],
      default: "Not Reported",
    },
    overallratings: {
      type: Number,
    },
    photos: {
      type: [String],
      validate: {
        validator: (arr) => arr.length <= 5, // ✅ limit to max 5 photos
        message: "You can upload a maximum of 5 photos.",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.SellingProperties ||
  mongoose.model("SellingProperties", sellingPropertiesSchema);
