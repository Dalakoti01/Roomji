import mongoose,{Schema} from "mongoose";

const messageSchema =  new Schema({
    sender : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    receiver : {
        type : Schema.Types.ObjectId,   
        ref : "User"
    },
    message : {
        type : String,
        required : true
    }
},{timestamps: true});

export default mongoose.models.Message ||
  mongoose.model("Message", messageSchema);
