import * as vscode from 'vscode';
import parser from './parser/parser.js';

// const obj = parser('./parser/App.jsx');
const obj = parser('./App.jsx');

export function activate(context: vscode.ExtensionContext) {
  // webviewView
  const provider = new NexusProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(NexusProvider.viewType, provider)
  );

  // debugger terminal - success notification
  console.log('Congratulations, your extension "nexus" is now active!');
  // console.log(obj);

  // vscode window.alert
  let disposable = vscode.commands.registerCommand('nexus.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World from Nexus!');
  });

  context.subscriptions.push(disposable);
}

// class object for webviewView content
class NexusProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'nexus.componentTreeView';
  // componentTree: any;
  constructor(private readonly _extensionUri: vscode.Uri) {
    // obj = undefined;
  }

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };
    // obj = parser('./parser/App.jsx');
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  _getHtmlForWebview(webview: vscode.Webview) {
    // const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js')
    );
    const styles = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', 'styles.css')
    );

    // console.log('pls work! ', obj);
    const bodyEnd = `</ul>
  </li>
</ul>`;
    let body = `
<ul class="root-tree">
<li><span class="tree" id="main-app-root">App</span>
  <ul class="subtree">
`;
    for (let i = 0; i < obj.length; i++) {
      if (obj[i]['children'].length > 0) {
        body += `<li><span class="tree">${obj[i]['name']}</span>`;
      } else {
        body += `<li class="top-level-tree">${obj[i]['name']}`;
      }
      if (obj[i]['children'].length > 0) {
        body += `<ul class="subtree" id='subtree'>`;
        for (let j = 0; j < obj[i]['children'].length; j++) {
          body += `<li class="third-level">${obj[i]['children'][j]['name']}</li>`;
        }
        body += `</ul></li>`;
      } else {
        body += `</li>`;
      }
    }
    body += bodyEnd;

    // props
    // iterate through the array of nodes that is returned from the parser
    // if the length of the value of the props property inside each object is greater than zero
    // list out the propsin a list
    for (let i = 0; i < obj.length; i++) {
      if (obj[i]['props'].length > 0) {
      }
    }
    console.log(body);
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
      <div class="main-container">
      ${body}
		  <script src="${scriptUri}"></script>
      </div>
			</body>
			</html>`;
  }
}

export function deactivate() {}

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
