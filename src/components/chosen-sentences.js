import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import ListItemText from "@material-ui/core/ListItemText"
import IconButton from "@material-ui/core/IconButton"
import Typography from "@material-ui/core/Typography"
import DeleteIcon from "@material-ui/icons/Delete"
import { Divider, Paper } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  list: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    padding: theme.spacing(2, 2, 0),
    margin: theme.spacing(0, 3, 0),
  },
  oneitem: {
    padding: theme.spacing(0, 0),
    margin: theme.spacing(0, 2),
  },
}))

export default function ChosenSentences(props) {
  const classes = useStyles()

  return (
    <Paper>
      <Typography variant="h6" className={classes.title}>
        Chosen sentences
      </Typography>
      <List className={classes.list} dense={true}>
        {props.data.map(record => {
          return (
            <>
              <ListItem key={record.key} className={classes.oneitem}>
                <ListItemText key={record.key} primary={record.sentence} />
                <ListItemSecondaryAction
                  key={record.key}
                  title="Remove sentence"
                  onClick={event => {
                    props.removeSentence(record)
                  }}
                >
                  <IconButton key={record.key} edge="end" aria-label="delete">
                    <DeleteIcon key={record.key} />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider variant="middle" />
            </>
          )
        })}
      </List>
    </Paper>
  )
}
