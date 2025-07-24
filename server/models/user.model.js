import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
     fullName:{
        type:String,       
     },
     email:{
        type:String,
        required:true,
        unique:true
     },
     password:{
        type:String,                
     },
     phoneNumber:{
      type: String,
      unique: true,
      sparse: true,
     },
     cart:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Cart'
     },
     address :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Address'
     },
     resetPasswordToken : {
        type: String,
        default: null
     },
     resetPasswordTokenExpires : {
        type: Date,
        default: null
     },
     wishList:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Wishlist'
     },
},
{
    timestamps:true
})

userSchema.methods = {
    
        generateAccessToken : async function(){
            const user = this.toObject()
             const token = jwt.sign({id:user._id,email:user.email,fullName:user.fullName}, process.env.USER_SECRET_KEY,{expiresIn:'7d'})    
             return token;
        },
        comparePassword : async function(plainText){
                 return await bcrypt.compare(plainText,this.password)
        },
    
        generateRefreshToken : async function(){
            const user = this.toObject()
            const refreshToken = jwt.sign({id:user._id,email:user.email,fullName:user.fullName}, process.env.USER_REFRESH_SECRET_KEY,{expiresIn:'7d'})
            return refreshToken;
        }
}

const User = mongoose.model('User',userSchema)

export default User