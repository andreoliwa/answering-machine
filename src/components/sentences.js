// TODO search box for available sentences
// TODO drag sentences to sort them
import React from "react"
import { Button, Table, Row, Col, Input, message } from "antd"
import UploadSentenceFile from "./upload-sentence-file"
const { Column } = Table

const defaultSentences = `
Hi, {person},
Hello, {person},
Dear {person},

Thanks.
Sorry.

Best regards.
Have a nice weekend and best regards.
Have a nice day and best regards.
`

const parseSentences = text =>
  text
    .split("\n")
    .map(e => e.trim())
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
    parseSentences(sentencesArray).forEach(element => {
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

    var finalMessage = sentences.join("\n").replace(/\{person\}/g, person)
    this.setState({ finalMessage: finalMessage })
  }

  addSentence(record, rowIndex) {
    if (this.state.keys.has(record.key)) {
      return
    }
    this.state.keys.add(record.key)
    this.state.chosen.push(record)

    this.buildFinalMessage(this.state.person)
    this.setState({ keys: this.state.keys, chosen: this.state.chosen })
  }

  removeSentence(record, rowIndex) {
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
    return (
      <Row gutter={16}>
        <Col span={10}>
          <Table
            pagination={false}
            dataSource={this.state.available}
            scroll={{ y: 600 }}
            size="small"
            showHeader={true}
            onRow={(record, rowIndex) => {
              return {
                onClick: () => {
                  this.addSentence(record, rowIndex)
                },
              }
            }}
          >
            <Column
              title="Available sentences"
              dataIndex="sentence"
              key="sentence"
            />
          </Table>
        </Col>
        <Col span={7}>
          <Table
            pagination={false}
            dataSource={this.state.chosen}
            size="small"
            showHeader={true}
            onRow={(record, rowIndex) => {
              return {
                onClick: () => {
                  this.removeSentence(record, rowIndex)
                },
              }
            }}
          >
            <Column
              title="Chosen sentences"
              dataIndex="sentence"
              key="sentence"
            />
          </Table>
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
