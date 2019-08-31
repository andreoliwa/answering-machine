// FIXME load sentences from file
// TODO copy final sentences to clipboard
// TODO drag sentences to sort them
// TODO search box for available sentences
// TODO remove docs directory
import React from "react"
import { Button, Table, Row, Col, Input } from "antd"
const leftColumns = [
  {
    title: "Available sentences",
    dataIndex: "sentence",
    key: "sentence",
  },
]
const rightColumns = [
  {
    title: "Chosen sentences",
    dataIndex: "sentence",
    key: "sentence",
  },
]

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

const loadedSentences = []
var i = 0
parseSentences(defaultSentences).forEach(element => {
  ++i
  loadedSentences.push({
    key: i.toString(),
    sentence: element,
  })
})

class Sentences extends React.Component {
  constructor(props) {
    super(props)
    const keySet = new Set()
    this.state = { chosen: [], keys: keySet, finalMessage: "", person: "" }

    // This binding is necessary to make `this` work in the callback
    this.buildFinalMessage = this.buildFinalMessage.bind(this)
    this.addSentence = this.addSentence.bind(this)
    this.removeSentence = this.removeSentence.bind(this)
    this.clearSentences = this.clearSentences.bind(this)
    this.onChange = this.onChange.bind(this)
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

  render() {
    return (
      <Row gutter={16}>
        <Col span={8}>
          <Table
            pagination={false}
            columns={leftColumns}
            dataSource={loadedSentences}
            size="small"
            showHeader={true}
            onRow={(record, rowIndex) => {
              return {
                onClick: () => {
                  this.addSentence(record, rowIndex)
                },
              }
            }}
          />
        </Col>
        <Col span={8}>
          <Table
            pagination={false}
            columns={rightColumns}
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
          />
        </Col>
        <Col span={8}>
          <Row gutter={16}>
            <Col span={12}>
              <Button type="primary" block disabled={true}>
                Copy to clipboard
              </Button>
            </Col>
            <Col span={12}>
              <Button type="danger" block onClick={this.clearSentences}>
                Clear all sentences
              </Button>
            </Col>
          </Row>
          <p></p>
          <p></p>
          <span>Person:</span>
          <Row>
            <Input id="person" onChange={this.onChange} />
          </Row>
          <p></p>
          <span>Final message:</span>
          <Row>
            <Input.TextArea autosize={true} value={this.state.finalMessage} />
          </Row>
        </Col>
      </Row>
    )
  }
}

export default Sentences
