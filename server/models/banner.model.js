import mongoose from "mongoose";



const bannerSchema =  new mongoose.Schema({    
    bannerImage :[{
        secureUrl:{ type : String },
        publicId: { type : String },
        uniqueId: { type:  String }
    }],
})



const Banner = mongoose.model('Banner',bannerSchema)
export default Banner