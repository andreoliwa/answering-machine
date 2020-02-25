import React from "react"
import { Button, Input, message } from "antd"
import MaterialTable from "material-table"
import Grid from "@material-ui/core/Grid"
import UploadSentenceFile from "./upload-sentence-file"
import ChosenSentences from "./chosen-sentences"

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

  pushSentenceObjects(sentencesAsText) {
    let index = 0
    const targetArray = []
    cleanSentences(sentencesAsText).forEach(line => {
      targetArray.push({
        key: index.toString(),
        sentence: line,
      })
      ++index
    })
    return targetArray
  }

  buildFinalMessage() {
    const sentences = []
    this.state.chosen.forEach(obj => {
      sentences.push(obj.sentence)
    })

    const finalMessage = sentences
      .join("\n")
      .replace(/¶/g, "\n")
      .replace(/\{person\}/g, this.state.person)
    return finalMessage
  }

  addSentence(record) {
    const { chosen } = this.state
    if (chosen.some(e => e.key === record.key)) {
      return
    }
    chosen.push(record)
    this.setState({ chosen })
  }

  removeSentence(record) {
    const { chosen } = this.state
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
    // Get all available sentences from the text file
    const available = this.pushSentenceObjects(textContent)

    // Save existing sentences on a set
    const { chosen } = this.state
    let existingSentences = new Set()
    chosen
      .filter(a => available.some(b => a.sentence === b.sentence))
      .forEach(obj => {
        existingSentences.add(obj.sentence)
      })

    // Clear chosen sentences and restore the previously existing sentences.
    chosen.splice(0)
    available.forEach(obj => {
      if (existingSentences.has(obj.sentence)) {
        chosen.push(obj)
      }
    })

    this.setState({ chosen, available })
  }

  copyToClipboard() {
    const copyTextarea = document.querySelector("#finalMessage")
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
                  const { chosen } = this.state
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
          <p />
          <Grid item xs={12}>
            <span>Person:</span>
            <Input
              id="person"
              onChange={event => {
                this.setState({ person: event.target.value })
              }}
            />
          </Grid>
          <p />
          <Grid item xs={12}>
            <span>Final message:</span>
            <Input.TextArea
              id="finalMessage"
              autosize
              value={this.buildFinalMessage()}
            />
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default Sentences
