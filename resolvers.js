const { AuthenticationError }= require('apollo-server')

const user={
    _id:"1",
    name:"sai",
    email:"sai@example.com",
    picture:"https://cloudinary.com/asdf"
}


const authenticated = next => (root,args,ctx,info)=>{
if(!ctx.currentUser){
    throw new AuthenticationError('Log in first')
}
return next(root,args,ctx,info)
}


module.exports={
    Query:{
        me:authenticated((root,args,ctx,info)=>ctx.currentUser)
    }
}