import React from "react"
// import { makeStyles } from "@material-ui/core/styles"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import ListItemText from "@material-ui/core/ListItemText"
import IconButton from "@material-ui/core/IconButton"
import Typography from "@material-ui/core/Typography"
import DeleteIcon from "@material-ui/icons/Delete"
import { Divider, Paper } from "@material-ui/core"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

// const useStyles = makeStyles(theme => ({
//   list: {
//     backgroundColor: theme.palette.background.paper,
//   },
//   title: {
//     padding: theme.spacing(2, 2, 0),
//     margin: theme.spacing(0, 3, 0),
//   },
//   oneitem: {
//     padding: theme.spacing(0, 0),
//     margin: theme.spacing(0, 2),
//   },
// }))

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const grid = 0

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "white",

  // styles we need to apply on draggables
  ...draggableStyle,
})

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "white",
  padding: grid,
})

// TODO convert this to a hook and use the styles above
class ChosenSentences extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: props.data,
      setNewOrder: props.setNewOrder,
    }
    this.removeSentence = props.removeSentence

    this.onDragEnd = this.onDragEnd.bind(this)
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    )

    this.setState({
      items,
    })
    this.state.setNewOrder(items)
  }

  render() {
    return (
      <Paper>
        <Typography
          variant="h6"
          // className={classes.title}
        >
          Chosen sentences
        </Typography>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <List
                // className={classes.list}
                dense={true}
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {this.state.items.map((record, index) => (
                  <Draggable
                    key={record.key}
                    draggableId={record.key}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <ListItem
                          key={record.key}
                          // className={classes.oneitem}
                        >
                          <ListItemText
                            key={record.key}
                            primary={record.sentence}
                          />
                          <ListItemSecondaryAction
                            key={record.key}
                            title="Remove sentence"
                            onClick={event => {
                              this.removeSentence(record)
                            }}
                          >
                            <IconButton
                              key={record.key}
                              edge="end"
                              aria-label="delete"
                            >
                              <DeleteIcon key={record.key} />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider variant="middle" />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      </Paper>
    )
  }
}

export default ChosenSentences
