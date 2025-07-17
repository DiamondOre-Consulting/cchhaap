const asyncHandler = function(functionHandler){
    return (req,res,next) =>{
        Promise.resolve(functionHandler(req, res, next)).catch((err)=>{next(err)}
      )
    }
}

export {asyncHandler}