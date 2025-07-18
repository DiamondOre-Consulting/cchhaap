import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'


const adminSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    phoneNumber:{
        type:String,
        required:true,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
        unique:true,
        trim:true 
    },
    password:{
        type:String,
        required:true,
        select:false,
    },
    resetPasswordToken:{
        type:String,
        select:false,
    },
    resetPasswordTokenExpires:{
        type:Date,
        select:false,
    },
    refreshAccessToken:{
        type:String
    },
    role:{
        type:String,
        enum: ['superAdmin', 'subAdmin']
    }
 
},{
    timestamps:true
})


adminSchema.methods = {

    generateAccessToken : async function(){
        const user = this.toObject()
         const token = jwt.sign({id:user._id,email:user.email,fullName:user.fullName, role:"Admin"}, process.env.SECRET_KEY,{expiresIn:'7d'})

         return token;
    },
    comparePassword : async function(plainText){
             return await bcrypt.compare(plainText,this.password)
    },

    generateRefreshToken : async function(){
        const user = this.toObject()
        const refreshToken = jwt.sign({id:user._id,email:user.email,fullName:user.fullName, role:"Admin"}, process.env.REFRESH_SECRET_KEY,{expiresIn:'7d'})
        return refreshToken;
    }

};

const Admin = mongoose.model('Admin',adminSchema)

export default Admin;