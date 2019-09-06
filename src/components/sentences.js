import React from "react"
import { Button, Input, message } from "antd"
import UploadSentenceFile from "./upload-sentence-file"
import MaterialTable from "material-table"
import ChosenSentences from "./chosen-sentences"
import Grid from "@material-ui/core/Grid"

const defaultSentences = `
Hi, {person},|
Hello, {person},|
Dear {person},|
Thanks.
Sorry.
Let's keep in touch.
|Best regards.|Me
|Have a nice weekend and best regards.|Me
|Have a nice day and best regards.|Me
`

const cleanSentences = text =>
  text
    .split("\n")
    .map(e => e.trim().replace(/\|/g, "¶"))
    .filter(e => e !== "")

class Sentences extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      available: this.pushSentenceObjects(defaultSentences),
      chosen: [],
      person: "",
    }

    // Some bindings are necessary to make `this` work in the callback
    this.onFileUploaded = this.onFileUploaded.bind(this)
    this.removeSentence = this.removeSentence.bind(this)
    this.onOrderChanged = this.onOrderChanged.bind(this)
  }

  pushSentenceObjects(sentencesArray) {
    var index = 0,
      targetArray = []
    cleanSentences(sentencesArray).forEach(element => {
      targetArray.push({
        key: index.toString(),
        sentence: element,
      })
      ++index
    })
    return targetArray
  }

  buildFinalMessage() {
    var sentences = []
    this.state.chosen.forEach(element => {
      sentences.push(element.sentence)
    })

    var finalMessage = sentences
      .join("\n")
      .replace(/¶/g, "\n")
      .replace(/\{person\}/g, this.state.person)
    return finalMessage
  }

  addSentence(record) {
    const chosen = this.state.chosen
    if (chosen.some(e => e.key === record.key)) {
      return
    }
    chosen.push(record)
    this.setState({ chosen })
  }

  removeSentence(record) {
    const chosen = this.state.chosen
    for (let index = 0; index < chosen.length; index++) {
      const element = chosen[index]
      if (element === record) {
        chosen.splice(index, 1)
      }
    }

    this.setState({ chosen })
  }

  onOrderChanged(reorderedChosenSentences) {
    this.setState({ chosen: reorderedChosenSentences })
  }

  onFileUploaded(textContent) {
    const chosen = this.state.chosen
    chosen.splice(0)

    const available = this.pushSentenceObjects(textContent)

    this.setState({ chosen, available })
  }

  copyToClipboard() {
    var copyTextarea = document.querySelector("#finalMessage")
    copyTextarea.select()

    try {
      document.execCommand("copy")
      message.success("Final message copied to the clipboard.")
    } catch (err) {
      console.log(err)
      message.error(
        "Oops, unable to copy for some reason. Check the console log."
      )
    }
  }

  render() {
    return (
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <MaterialTable
            title="Available sentences"
            columns={[{ field: "sentence" }]}
            data={this.state.available}
            // https://material-table.com/#/docs/all-props
            options={{
              padding: "dense",
              header: false,
              pageSize: this.state.available.length,
              paging: false,
            }}
            onRowClick={(event, rowData) => {
              this.addSentence(rowData)
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <ChosenSentences
            chosen={this.state.chosen}
            removeSentence={this.removeSentence}
            onOrderChanged={this.onOrderChanged}
          />
        </Grid>
        <Grid item xs={4}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <UploadSentenceFile onFileUploaded={this.onFileUploaded} />
            </Grid>
            <Grid item xs={4}>
              <Button
                type="primary"
                block
                title="Copy the final message to the clipboard"
                onClick={this.copyToClipboard}
                disabled={!this.state.chosen.length}
              >
                Copy
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                type="danger"
                block
                onClick={event => {
                  const chosen = this.state.chosen
                  chosen.splice(0)
                  this.setState({ chosen })
                }}
                title="Clear chosen sentences"
                disabled={!this.state.chosen.length}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
          <p></p>
          <Grid item xs={12}>
            <span>Person:</span>
            <Input
              id="person"
              onChange={event => {
                this.setState({ person: event.target.value })
              }}
            />
          </Grid>
          <p></p>
          <Grid item xs={12}>
            <span>Final message:</span>
            <Input.TextArea
              id="finalMessage"
              autosize={true}
              value={this.buildFinalMessage()}
            />
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default Sentences
