import mongoose from "mongoose";

const connectToDb = async()=>{
    
    const mongoURI = process.env.MONGO_URI;
     
    if(!mongoURI){
        console.log('MONGO_URI is not defined');
        return
    }
    try{
        await mongoose.connect(mongoURI);       
        console.log("Connected to MongoDB")
    }
    catch(err){
        console.log("Error in connecting to MongoDB",err)
    }
}

export default connectToDb