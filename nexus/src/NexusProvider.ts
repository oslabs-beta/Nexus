import { Parser } from './parser/parserv2.js';
import * as vscode from 'vscode';
const path = require('path');
const fs = require('fs');

// class object for webviewView content
export class NexusProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  public static readonly viewType = 'nexus.componentTreeView';
  // componentTree: any;
  constructor(private readonly _extensionUri: vscode.Uri) {
    // obj = undefined;
  }

  // function
  // run parser
  // grab data
  // send message to webviewAPI with data using webview.postMessage(data)

  public parseCodeBaseAndSendMessage(filePath: string) {

    console.log('dirname: ', __dirname);
    console.log('passed-in filepath: ', filePath);
    console.log('path.resolve hardcoded: ', path.resolve(__dirname, './parser/App.jsx'));

    // const resultObj = new Parser(fs.readFileSync('mnt/c/C:\\Users\\Nico\\Desktop\\nexus-copy\\out\\parser\\App.jsx')); // --> works //path.resolve:
    //passed-in filepath:  C:\Users\Nico\Desktop\nexus-copy\out\parser\App.jsx

    let str = filePath;
    // let str;

    if (process.platform === 'linux') {
      if (/wsl\$/.test(filePath)) {
        // filePath = // -> \\wsl$\Ubuntu-20.04\home\nicoflo\unit-6-react-tic-tac-toe\src\app.jsx

        str = '/home' + filePath.split('home')[1].replace(/\\/g, '/');

        console.log(str);
        
      } else {
        str = '/mnt/c/' + filePath.slice(3);

        str = str.replace(/\\/g, '/');
      }
    }

    console.log('initial string: ', str);

    // \\wsl$\
    const resultObj = new Parser(fs.readFileSync(str), str); // --> works //path.resolve:   
    // const resultObj = new Parser(fs.readFileSync('/mnt/c/Users/Nico/Desktop/nexus-copy/out/parser/App.jsx')); // --> works //path.resolve:   
    console.log(path.win32.sep);
    console.log(path.posix.sep);

    // const resultObj = new Parser(fs.readFileSync('/mnt/c/Users/Nico/Desktop/nexus-copy/out/parser/App.jsx')); // --> works //path.resolve:

    // const resultObj = new Parser(fs.readFileSync(path.resolve(__dirname, './parser/App.jsx'))); // -> works
    // const resultObj = new Parser(fs.readFileSync(path.resolve(__dirname, '/Users/davidlee/Nexus/nexus/src/parser/newApp.jsx'))); // -> works
    const data = resultObj.main();



  // debugger terminal - success notification

    // debugger terminal - success notification
    console.log('Congratulations, your extension "nexus" is now active!');

    // console.log('in parse and send message');
    this._view.webview.postMessage({ name: 'App', children: data });
  }

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    console.log('process.platform test: ', process.platform);

    webviewView.webview.onDidReceiveMessage(async data => {
      // OG File Path = './parser/newApp.jsx'
      switch (data.type) {
        case 'addFile': {
          console.log(data.value);
          this.parseCodeBaseAndSendMessage(data.value);
        }
      }
    });

    // obj = parser('./parser/App.jsx');
    // this.parseCodeBaseAndSendMessage(this._view);
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  _getHtmlForWebview(webview: vscode.Webview) {

    // const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist', 'sidebar.js')
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', 'styles.css')
    );

    // console.log(scriptUri);
    // console.log(styles);

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
