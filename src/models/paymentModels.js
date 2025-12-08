import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    amount: Number,
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    fullName: String,
    email: String,
    planDetail : {
        planDuration : {
            type : String,
            enum : ["quaterly","half-yearly","annually"]
        },
        planType : {
            type : String,
            enum : ["propertyPlan","servicePlan"]
        }
        
    },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", paymentSchema);
