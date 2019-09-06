import React from "react"
import { Upload, Button, Icon } from "antd"

const UploadSentenceFile = ({ onFileUploaded, ...otherProps }) => {
  const handleChange = info => {
    let newFileList = [...info.fileList]
    newFileList.map(file => {
      var reader = new FileReader()
      reader.onload = e => {
        onFileUploaded(e.target.result)
      }
      reader.readAsText(file.originFileObj)

      return file
    })
  }

  const uploadProps = {
    onChange: handleChange,
    multiple: false,
    showUploadList: false,
  }

  return (
    <Upload {...uploadProps} {...otherProps}>
      <Button title="Upload a file with sentences">
        <Icon type="upload" /> Upload
      </Button>
    </Upload>
  )
}

export default UploadSentenceFile
