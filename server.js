const { ApolloServer } =require('apollo-server')

const typeDefs=require('./typeDefs')
const resolvers=require('./resolvers')
const mongoose=require('mongoose')

require('dotenv').config()

const { findOrCreateUser }=require('./controllers/userController')

mongoose.connect(process.env.MONGO_URL,{

    useNewUrlParser:true,
    useUnifiedTopology: true

}).then(()=>{
    console.log('GeoPinsDB connected')
}).catch(e=>console.error(e.message ))

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:async ({ req })=>{
      
        let authToken=null
        
        let currentUser=null

        try{
           authToken = req.headers.authorization

           if(authToken){
                
            currentUser=await  findOrCreateUser(authToken)

           }
        

        }catch(e){
            console.log(e.message)
        }

        return {currentUser}   

    }
})

server.listen().then (({url})=>{
    console.log(`Server listening on ${url}`)
})