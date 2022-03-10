import React, { Component } from 'react';

export default class AddFile extends Component {
  constructor() {
    super();
    this.state = {
      uploaded: false,
    };
    this.handleAddFile = this.handleAddFile.bind(this);
    // acquire the vscode API. store as a property so multiple file uploads do not error when attempting to acquire the api again
    this.vscodeApi = acquireVsCodeApi();
  }

  // handler function invoked when file is added
  handleAddFile(e) {
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
    return (
      <div className="add-file-container">
        {/* if the file has not been uploaded, render the welcome text. if it has been uploaded, render the success message */}
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
      </div>
    );
  }
}
