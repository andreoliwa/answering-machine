// TODO search box for available sentences
// TODO drag sentences to sort them
// TODO copy final sentences to clipboard
// TODO remove docs directory
import React from "react"
import { Button, Table, Row, Col, Input } from "antd"
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

    const keySet = new Set()
    const available = this.pushSentenceObjects(defaultSentences)
    this.state = {
      available,
      chosen: [],
      keys: keySet,
      finalMessage: "",
      person: "",
    }

    // This binding is necessary to make `this` work in the callback
    this.buildFinalMessage = this.buildFinalMessage.bind(this)
    this.addSentence = this.addSentence.bind(this)
    this.removeSentence = this.removeSentence.bind(this)
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
          <Row gutter={16}>
            <Col span={8}>
              <UploadSentenceFile onFileUploaded={this.onFileUploaded} />
            </Col>
            <Col span={8}>
              <Button type="primary" block disabled={true}>
                Copy to clipboard
              </Button>
            </Col>
            <Col span={8}>
              <Button type="danger" block onClick={this.clearSentences}>
                Clear sentences
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
            <Input.TextArea autosize={true} value={this.state.finalMessage} />
          </Row>
        </Col>
      </Row>
    )
  }
}

export default Sentences
