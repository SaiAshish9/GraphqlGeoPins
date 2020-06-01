import React,{useContext} from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {GraphQLClient} from 'graphql-request'
import { GoogleLogin } from 'react-google-login'
import Context from '../../context'
import {ME_QUERY} from '../../graphql/queries'


const Login = ({ classes }) => {

const { dispatch } =  useContext(Context)


const onSuccess= async googleUser=>{

try{
const id_token= googleUser.getAuthResponse().id_token
const client = new GraphQLClient('http://localhost:4000/graphql',{
  headers:{
   authorization:id_token
  }
})
const { me }=  await client.request(ME_QUERY)
// console.log({me})
dispatch({
type:"LOGIN_USER",
payload:me
})
}catch(e){
  onFailure(e)
}

}

const onFailure=err=>{
  console.error("Error logging in",err)
}



  return (
    <div className={classes.root}>

    <Typography
    component="h1"
    variant="h3"
    gutterBottom
    noWrap
    style={{fontSize:30,fontWeight:'bold',margin:20, color:"rgb(66,133,244)" }}
    >
        Welcome
    </Typography>


  <GoogleLogin 
  clientId="###########-tfhsnb4l7rummh8aqn3bu936h2qd5c2k.apps.googleusercontent.com"
  onSuccess={onSuccess}
  onFailure={onFailure}
  isSignedIn={true}
  theme="dark"
  />
      </div>

  )
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
