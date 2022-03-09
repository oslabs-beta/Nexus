import React, {Component} from 'react';


export default class AddFile extends Component {

  handleAddFile (e) {

    const vscodeApi = acquireVsCodeApi();

    console.log(e.target.files);
    // console.log(e.target.files[0].path);

    const filePath = e.target.files[0].path;

    vscodeApi.postMessage({
      type: 'addFile',
      value: filePath
    });

  }

  render () {
    return (
      <div className="addFileButton">
        <input type="file" name="file" className="fileInput" onChange={this.handleAddFile}/>
        {/* <label htmlFor="file">Upload Your File</label> */}
      </div>
    );
  }
}