import axios from 'axios'
import {
  ContentState,
  EditorState,
  convertFromHTML,
  convertToRaw,
} from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { Component } from 'react'
import { Editor } from 'react-draft-wysiwyg'
// import htmlToDraft from 'html-to-draftjs'
import '../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './text-editor.css'
class EditorConvertToHTML extends Component {
  state = {
    editorState: EditorState.createWithContent(
      ContentState.createFromBlockArray(
        convertFromHTML(this.props.description),
      ),
    ),
  }

  getValueTextEditor = () => {
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }

  onEditorStateChange = editorState => {
    this.setState({
      editorState,
    })
    // this.props.setDescription(
    //   draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())),
    // )
    // return onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())))
  }

  uploadImageCallBack = async file => {
    const formData = new FormData()
    formData.append('file', file)
    try {
      const token = window.localStorage.getItem('accessToken')
      const res = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_UPLOAD_URL}/api/file/upload?directory=cahnfc`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
      if (res) {
        console.log(res)
        return { data: { link: res.data.url } }
      }
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    const { editorState } = this.state
    return (
      <div style={{ marginBottom: '15px' }}>
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            image: {
              urlEnabled: true,
              uploadEnabled: true,
              alignmentEnabled: true,
              uploadCallback: this.uploadImageCallBack,
              previewImage: true,
              inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
              alt: { present: true, mandatory: false },
            },
          }}
        />
      </div>
    )
  }
}

export default EditorConvertToHTML
