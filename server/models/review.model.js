import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const reviewSchema = new Schema ({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:[true,"User details are required !"]
    },
    vendor:{
        type:Schema.Types.ObjectId,
        ref:"Vendor",
        required:[true,"Vendor details are required !"]
    },
    rating:{
        type:Number,
        required:true,
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot exceed 5"],
    },
    comment:{
        type:String,
        trim:true,
        maxlength:[200,"Can't exceed 200 characters"],
        required:[true,"Comment can't be left empty ! Please share your feedback !"]
    }
} ,
 {
    timestamps: true
})

const Review = mongoose.model('Review', reviewSchema);
export  {Review};