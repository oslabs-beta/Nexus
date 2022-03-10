import { ReactParser } from './parser/ReactParser.js';
import { NextParser } from './parser/NextParser.js';
import * as vscode from 'vscode';
const path = require('path');
const fs = require('fs');

// class object for webviewView content
export class NexusProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  public static readonly viewType = 'nexus.componentTreeView';
  constructor(private readonly _extensionUri: vscode.Uri) {
  }

  // send message to webviewAPI with data using webview.postMessage(data)
  public parseCodeBaseAndSendMessage(filePath: string) {   
    let str = filePath;
    
// allows for multi-platform compatability (Linux, Mac, etc.)
    if (process.platform === 'linux') {
      if (/wsl\$/.test(filePath)) {
        str = '/home' + filePath.split('home')[1].replace(/\\/g, '/');        
      } else {
        str = '/mnt/c/' + filePath.slice(3);
        
        str = str.replace(/\\/g, '/');
      }
    }

    let resultObj;
    
// if file is ending in '.js', send it into the Next.Js parser route
    if (str.slice(-3) === '.js') {
      resultObj = new NextParser(fs.readFileSync(str), str);
    }

// otherwise, send the file through the React parser route
    else {
      resultObj = new ReactParser(fs.readFileSync(str));
    }

// pull the parsed object from the parser, to be sent to the front-end
    const data = resultObj.main();
    console.log('Congratulations, your extension "nexus" is now active!');
    this._view.webview.postMessage({ name: 'App', children: data });
  }

// stage the initial html elements to the VSCode WebviewView
  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.onDidReceiveMessage(async data => {
      switch (data.type) {
        case 'addFile': {
          this.parseCodeBaseAndSendMessage(data.value);
        }
      }
    });
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist', 'sidebar.js')
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', 'styles.css')
    );
  
    return `<!DOCTYPE html>
        <html lang="en">
        <head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
				<link href="${styleVSCodeUri}" rel="stylesheet">
        </head>
        <body>
        <div id = "root"></div>
        <script src="${scriptUri}"></script>
        </body>
        </html>`;
  }
}

export function deactivate() {}
