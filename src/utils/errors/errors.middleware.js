export const errorMiddleware =(error,req,res,next)=>{
    res.send({
        status: error.name,
        message: error.message,
        cause: error.cause
    })
}