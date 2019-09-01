// TODO drag sentences to sort them
import React from "react"
import { Button, Row, Col, Input, message } from "antd"
import UploadSentenceFile from "./upload-sentence-file"
import MaterialTable from "material-table"

const defaultSentences = `
Hi, {person},|
Hello, {person},|
Dear {person},|
Thanks.
Sorry.
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
      keys: new Set(),
      finalMessage: "",
      person: "",
    }

    // Some bindings are necessary to make `this` work in the callback
    this.clearSentences = this.clearSentences.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onFileUploaded = this.onFileUploaded.bind(this)
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

  buildFinalMessage(person) {
    var sentences = []
    this.state.chosen.forEach(element => {
      sentences.push(element.sentence)
    })

    var finalMessage = sentences
      .join("\n")
      .replace(/¶/g, "\n")
      .replace(/\{person\}/g, person)
    this.setState({ finalMessage: finalMessage })
  }

  addSentence(record) {
    if (this.state.keys.has(record.key)) {
      return
    }
    this.state.keys.add(record.key)
    this.state.chosen.push(record)

    this.buildFinalMessage(this.state.person)
    this.setState({ keys: this.state.keys, chosen: this.state.chosen })
  }

  removeSentence(record) {
    this.state.keys.delete(record.key)
    for (let index = 0; index < this.state.chosen.length; index++) {
      const element = this.state.chosen[index]
      if (element === record) {
        this.state.chosen.splice(index, 1)
      }
    }

    this.buildFinalMessage(this.state.person)
    this.setState({ keys: this.state.keys, chosen: this.state.chosen })
  }

  clearSentences() {
    this.setState({ chosen: [], keys: new Set(), finalMessage: [] })
  }

  onChange(event) {
    this.setState({ person: event.target.value })
    this.buildFinalMessage(event.target.value)
  }

  onFileUploaded(textContent) {
    this.clearSentences()
    let available = this.pushSentenceObjects(textContent)
    this.setState({ available })
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
    // https://github.com/mbrn/material-table
    return (
      <Row gutter={16}>
        <Col span={10}>
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
        </Col>
        <Col span={7}>
          <MaterialTable
            title="Chosen sentences"
            columns={[{ field: "sentence" }]}
            data={this.state.chosen}
            // // https://material-table.com/#/docs/all-props
            options={{
              padding: "dense",
              header: false,
              pageSize: this.state.chosen.length,
              paging: false,
              search: false,
            }}
            actions={[
              {
                icon: "delete",
                tooltip: "Remove",
                onClick: (event, rowData) => {
                  this.removeSentence(rowData)
                },
              },
            ]}
          />
        </Col>
        <Col span={7}>
          <Row gutter={8}>
            <Col span={8}>
              <UploadSentenceFile onFileUploaded={this.onFileUploaded} />
            </Col>
            <Col span={8}>
              <Button
                type="primary"
                block
                title="Copy the final message to the clipboard"
                onClick={this.copyToClipboard}
                disabled={!this.state.chosen.length}
              >
                Copy
              </Button>
            </Col>
            <Col span={8}>
              <Button
                type="danger"
                block
                onClick={this.clearSentences}
                title="Clear chosen sentences"
                disabled={!this.state.chosen.length}
              >
                Clear
              </Button>
            </Col>
          </Row>
          <p></p>
          <Row>
            <span>Person:</span>
            <Input id="person" onChange={this.onChange} />
          </Row>
          <p></p>
          <Row>
            <span>Final message:</span>
            <Input.TextArea
              id="finalMessage"
              autosize={true}
              value={this.state.finalMessage}
            />
          </Row>
        </Col>
      </Row>
    )
  }
}

export default Sentences
