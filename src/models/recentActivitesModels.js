import mongoose,{Schema} from 'mongoose';

const recentActivitiesSchema = new Schema({
    user : {type:Schema.Types.ObjectId, ref:'User'},
    fullName : {type : String, required:true},
    type : {
        type  : String,
        enum : ['User Joined','User Left','Property Posted','Feedback Submitted','Admin Support'],
    },
    content : {type : String, required:true},


},{timestamps:true});

export const RecentActivities = mongoose.model('RecentActivities', recentActivitiesSchema);
export default RecentActivities;