const mongoose=require('mongoose');
const schema=new mongoose.Schema({
    field1:String,
    field2:String,
    field3:String,
    field4:String,
    field5:String,
    field6:String,
    field7:String,
    deadline:String,
    name:String,
})
const Customer=mongoose.model('CUSTOMERS',schema);
module.exports=Customer;