import { z } from "zod";

const validate = (schemas) => (req, res, next) => {
  try {
      
      const validatedData = {};

  

      
      if(schemas.body){ 
        validatedData.body  = schemas.body.parse(req.body);
       
      }
     
      if(schemas.params){
       
        validatedData.params = schemas.params.parse(req.params);
     
      }
      if(schemas.query){
        validatedData.query = schemas.query.parse(req.query);
      }  

    
      req.validatedData = validatedData;
      next(); 
  } catch (error) {
    
      console.log(error)
      if (error instanceof z.ZodError) {
          return res.status(400).json({
              success: false,
              errors: error.errors.map(err => ({
                  field: err.path[0],
                  message: err.message
              }))
          });
      }
      next(error); 
  }
};

export default validate;