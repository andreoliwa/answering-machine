import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}))

const Header = ({ siteTitle }) => {
  const classes = useStyles()
  return (
    <AppBar
      position="static"
      className={classes.root}
      style={{
        background: `rebeccapurple`,
        marginBottom: `0.93rem`,
      }}
    >
      <Toolbar variant="dense">
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >
          <Typography variant="h6" color="inherit">
            {siteTitle}
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  )
}
Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
