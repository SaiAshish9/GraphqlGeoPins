import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Explore from "@material-ui/icons/Explore";
import Typography from "@material-ui/core/Typography";

const NoContent = ({ classes }) =>(
  <div className={classes.root}>
       <Explore className={classes.icon}/>
      <Typography
      noWrap
      component="h2"
      variant="h6"
      align="center"
      color="textPrimary"
      >
Click on the map to add a pin
      </Typography>

  </div>
)

const styles = theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center"
  },
  icon: {
    margin: theme.spacing.unit,
    fontSize: "80px"
  }
});

export default withStyles(styles)(NoContent);
