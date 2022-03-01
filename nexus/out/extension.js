"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
// import parser from './parser/parser.js';
// const obj = parser('./parser/App.jsx');
// const obj = parser('./App.jsx');
function activate(context) {
    // webviewView
    const provider = new NexusProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(NexusProvider.viewType, provider));
    // debugger terminal - success notification
    console.log('Congratulations, your extension "nexus" is now active!');
    // console.log(obj);
    // vscode window.alert
    let disposable = vscode.commands.registerCommand('nexus.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from Nexus!');
    });
    context.subscriptions.push(disposable);
    // register parse command
    let parsePush = vscode.commands.registerCommand('nexus.parseCode', (webviewView) => {
        // console.log(webviewView);
        console.log('within parsePush command');
        provider.parseCodeBaseAndSendMessage();
    });
    context.subscriptions.push(parsePush);
}
exports.activate = activate;
// class object for webviewView content
class NexusProvider {
    // componentTree: any;
    constructor(_extensionUri) {
        // obj = undefined;
        this._extensionUri = _extensionUri;
    }
    // function
    // run parser
    // grab data
    // send message to webviewAPI with data using webview.postMessage(data)
    parseCodeBaseAndSendMessage() {
        console.log('in parse and send message');
        const dummyData = {
            name: 'App',
            children: [{ name: 'Gross Poopy Diaper David', children: [''], props: { price: '5000' } }, { name: 'Senior Citizen with Dentures Alex', children: ['Brian'], props: { price: '2' } }],
            props: { example: 'test' },
        };
        this._view.webview.postMessage(dummyData);
    }
    resolveWebviewView(webviewView) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };
        // obj = parser('./parser/App.jsx');
        // this.parseCodeBaseAndSendMessage(this._view);
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    }
    _getHtmlForWebview(webview) {
        console.log('running gethtmlforwebview');
        // const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'sidebar.js'));
        const styles = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'styles.css'));
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
				<link href="${styles}" rel="stylesheet">
			</head>
			<body>
      <div id = "root"></div>
      <script src="${scriptUri}"></script>
			</body>
			</html>`;
    }
}
NexusProvider.viewType = 'nexus.componentTreeView';
function deactivate() { }
exports.deactivate = deactivate;
//______________________NICOOOOO_______________
// console.log('pls work! ', obj);
//     const bodyEnd = `</ul>
//   </li>
// </ul>`;
//     let body = `
// <ul class="root-tree">
// <li><span class="tree" id="main-app-root">App</span>
//   <ul class="subtree">
// `;
// for (let i = 0; i < obj.length; i++) {
//   if (obj[i]['children'].length > 0) {
//     body += `<li><span class="tree">${obj[i]['name']}</span>`;
//   } else {
//     body += `<li class="top-level-tree">${obj[i]['name']}`;
//   }
//   if (obj[i]['children'].length > 0) {
//     body += `<ul class="subtree" id='subtree'>`;
//     for (let j = 0; j < obj[i]['children'].length; j++) {
//       body += `<li class="third-level">${obj[i]['children'][j]['name']}</li>`;
//     }
//     body += `</ul></li>`;
//   } else {
//     body += `</li>`;
//   }
// }
// body += bodyEnd;
// props
// iterate through the array of nodes that is returned from the parser
// if the length of the value of the props property inside each object is greater than zero
// list out the propsin a list
// for (let i = 0; i < obj.length; i++) {
//   if (obj[i]['props'].length > 0) {
//   }
// }
// console.log(body);
/*
<ul class="root-tree">
  <li><span class="tree">pages</span>
    <ul class="subtree">
      <li>_app.js</li>
      <li><span class="tree">index.js</span>
          <ul class="subtree">
          <li>nav.js</li>
          <li>jumbotron.js</li>
          </ul>
      </li>
      <li><span class="tree">cats</span>
        <ul class="subtree">
        <li><span class="tree">index.js</span>
          <ul class="subtree">
          <li>nav.js</li>
          <li>card.js</li>
          </ul>
        </li>
        <li>[id].js</li>
        </ul>
      </li>
    </ul>
  </li>
</ul>
*/
//# sourceMappingURL=extension.js.map