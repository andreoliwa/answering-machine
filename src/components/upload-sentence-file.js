import React from "react"
import { Upload, Button, Icon } from "antd"

class UploadSentenceFile extends React.Component {
  state = {
    fileList: [],
    content: "",
  }

  handleChange = info => {
    let fileList = [...info.fileList]
    let content = ""

    fileList = fileList.map(file => {
      var reader = new FileReader()
      reader.onload = e => {
        content = e.target.result
        this.props.onFileUploaded(content)
      }
      reader.readAsText(file.originFileObj)

      return file
    })

    this.setState({ fileList, content })
  }

  render() {
    const props = {
      onChange: this.handleChange,
      multiple: false,
      showUploadList: false,
    }
    return (
      <Upload {...props} fileList={this.state.fileList}>
        <Button>
          <Icon type="upload" /> Upload file
        </Button>
      </Upload>
    )
  }
}
export default UploadSentenceFile
