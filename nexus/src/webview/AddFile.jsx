import React, { Component } from 'react';

export default class AddFile extends Component {
  constructor() {
    super();
    this.state = {
      uploaded: false,
    };
    this.handleAddFile = this.handleAddFile.bind(this);
    // acquire the vscode API
    this.vscodeApi = acquireVsCodeApi();
  }

  // handler function invoked when file is added
  handleAddFile(e) {
    console.log('added new file');

    const filePath = e.target.files[0].path;

    // post a message to the webview window, which the backend is listening for, including the filepath of the file as the payload, which the parser class will be able to pass into its constructor upon instantiation
    this.vscodeApi.postMessage({
      type: 'addFile',
      value: filePath,
    });

    // update state to render a different message after upload
    this.setState(prevState => ({
      ...prevState,
      uploaded: true,
    }));
  }

  render() {
    console.log('state', this.state);
    return (
      <div className="add-file-container">
        {!this.state.uploaded ? (
          <div>
            <h1 className="add-file-header">Welcome to Nexus!</h1>
            <p className="add-file-message">
              If you are working with a Next.js codebase, upload your top level index.js file in the
              pages directory.
            </p>
            <p className="add-file-message">
              If you are working with a React codebase, upload your top level App component that is
              rendered to the DOM.
            </p>
          </div>
        ) : (
          <div>
            <p className="add-file-message">
              Tree generated! Feel free to upload another entry file at any time
            </p>
          </div>
        )}
        <div className="add-file-btn-container">
          <input type="file" name="file" className="file-input" onChange={this.handleAddFile} />
        </div>
        {/* <label htmlFor="file" className="btn-file-input"></label> */}
        {/* <button className="fileInput" onclick={document.getElementById('file').click()}>
          Upload File
        </button>
        <input
          type="file"
          style="display:none;"
          id="file"
          name="file"
          onChange={this.handleAddFile}
        /> */}
      </div>
    );
  }
}
