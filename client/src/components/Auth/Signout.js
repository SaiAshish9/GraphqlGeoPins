import React,{useContext} from "react";
import { withStyles } from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Typography from "@material-ui/core/Typography";
import { GoogleLogout } from 'react-google-login'
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery'
import Context from '../../context'

const Signout = ({ classes }) => {
  

const { dispatch } = useContext(Context)

const mobileSize=  useMediaQuery('(max-width:650px)')


const onSignout=()=>{
  dispatch({
    type:"SIGNOUT_USER"
  })

  console.log("Signout user")


}

  return (
    <GoogleLogout
    onLogoutSuccess={onSignout}
    buttonText="Signout"
    render={({onClick})=>(
      <span  onClick={onClick}  className={classes.root} >   
            <Typography
            variant="body1"
            className={classes.buttonText}
            style={{
             display: mobileSize?"none":"block"
            }}
            >
                Signout
            </Typography>
      <ExitToAppIcon className={classes.buttonIcon} />


      </span>
    )}
    
    />
  )

};

const styles = {
  root: {
    cursor: "pointer",
    display: "flex"
  },
  buttonText: {
    color: "orange"
  },
  buttonIcon: {
    marginLeft: "5px",
    color: "orange"
  }
};

export default withStyles(styles)(Signout);
