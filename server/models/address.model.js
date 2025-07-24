import mongoose from 'mongoose'


const addressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, 
              ref: 'User', required: true },

    addresses:[
        { 
        fullName : {
        type : String,
        required : true
       },
       phoneNumber : {
        type : String,
        required : true
       },
       street: {
        type : String,
        required : true
       },
       city: {
        type : String,
        required : true
       },
       state: {
        type : String,
        required : true
       },
       country: {
        type : String,
        required : true,
        default:"India"
       },
       pinCode: {
        type : String,
        required : true
       },
       addressType:{
        type:String,
        enum:['home','work','office'],
        required:true
       },
       isDefault:{
        type:Boolean,
        default:false
        }
      }
    ]
})



const Address = mongoose.model('Address',addressSchema)

export default Address