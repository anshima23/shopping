const mongoose = require("mongoose");


const ChartSchema = new mongoose.Schema(
    {
        UserId:{ type:String, required: true, unique:true},
       products:[{
        productId:{type:String,},
        quantity:{type:Number,
            default:1,
        },
       },],
    },
    {timestamps:true}
);

module.exports = mongoose.model("Chart",ChartSchema);