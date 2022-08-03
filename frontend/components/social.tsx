import {makeStyles} from "@mui/material/styles";
import  Grid  from "@mui/material/Grid";
import { Instagram,Facebook,GitHub,Home } from "@mui/icons-material";
// if you wanto to add twitter
// import TwitterIcon from '@material-ui/icons/Twitter';

import { socialMedia } from "../data/socialMedia";
const useStyles = theme => ({
  snsIcon: {
    width: "30px",
    height: "30px",

    [theme.breakpoints.down("xs")]: {
      width: "25px",
      height: "25px",
    },
    "&:hover": {
      color: theme.palette.info.main,
    },
  },
});

const Social = ({ props }) => {
  const classes = props;
  // if you want to add more social medias, add it to here and /data/socialMedia.js.
  // and import the Material Icon, then add the code.
  const { instagram, facebook, github, homepage } = socialMedia;

  // if you add twitter , it will be
  // const { instagram, facebook, github, homepage, twitter } = socialMedia;
  {
    //  and add this code to line 98,
    /* <Grid
        item
        component={"a"}
        target="_blank"
        rel="noreferrer noopener"
        href={twitter}
      >
       <TwitterIcon className={classes.snsIcon} />
    </Grid> */
  }
  return (
    <Grid item container spacing={2} justifyContent="center">
      <Grid
        item
        component={"a"}
        target="_blank"
        rel="noreferrer noopener"
        href={homepage}
      >
        <Home
          className={classes.snsIcon}
          color={props ? "primary" : "secondary"}
        />
      </Grid>
      <Grid
        item
        component={"a"}
        target="_blank"
        rel="noreferrer noopener"
        href={facebook}
      >
        <Facebook
          className={classes.snsIcon}
          color={props ? "primary" : "secondary"}
        />
      </Grid>
      <Grid
        item
        component={"a"}
        target="_blank"
        rel="noreferrer noopener"
        href={instagram}
      >
        <Instagram
          className={classes.snsIcon}
          color={props ? "primary" : "secondary"}
        />
      </Grid>
      <Grid
        item
        component={"a"}
        target="_blank"
        rel="noreferrer noopener"
        href={github}
      >
        <GitHub
          className={classes.snsIcon}
          color={props ? "primary" : "secondary"}
        />
      </Grid>
      {/* add social media*/}
    </Grid>
  );
};

export default Social;