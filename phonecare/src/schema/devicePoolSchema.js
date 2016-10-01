var mongoose=require("../db/mongoConfig");

var Schema=mongoose.Schema;


var devicePoolSchema=new Schema({
	name:String
});

var devicePoolNames=mongoose.model("devicePools",devicePoolSchema);
module.exports=devicePoolNames;

