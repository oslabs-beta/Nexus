import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	
	// webviewView
	const provider = new ColorsViewProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(ColorsViewProvider.viewType, provider));

	// webview
	let openWebview = vscode.commands.registerCommand('exampleApp.openWebview', () => {
		const panel = vscode.window.createWebviewPanel(
		'Big Chungus',
		'Big Chungus',
		vscode.ViewColumn.One,
		{
			enableScripts: true
		}
		);
		panel.webview.html = getWebviewContent();
	  });
	  context.subscriptions.push(openWebview);

	// debugger terminal - success notification
	console.log('Congratulations, your extension "nexus" is now active!');

	// vscode window.alert
	let disposable = vscode.commands.registerCommand('nexus.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from Nexus!');
	});

	context.subscriptions.push(disposable);
}


// html for webview content
function getWebviewContent() {
	return `<!DOCTYPE html>
  <html lang="en">
  <head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>Example Webview</title>
  </head>
  <body>
	 <img src = "https://static.wikia.nocookie.net/supermarioglitchy4/images/f/f3/Big_chungus.png/revision/latest?cb=20200511041102" />
  </body>
  </html>`;
  }

// class object for webviewView content
  class ColorsViewProvider implements vscode.WebviewViewProvider {

	public static readonly viewType = 'calicoColors.colorsView';

	constructor(
		private readonly _extensionUri: vscode.Uri,
	) { } 

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
	) 
	{
		
		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [this._extensionUri]
		};
		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
	}

	_getHtmlForWebview(webview: vscode.Webview) {

		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));
		const styles = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'styles.css'));
		
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
			<h1 id="counter">0</h1>
			<div class="items">
			<ul>
			<li><a href="#" class="pages">pages</a>
				<ul>
					<li><a href="#">_app.js</a></li>  
					<li><a href="#">index.js</a>
						<ul>
							<li><a href="#">nav.js</a></li>
							<li><a href="#">jumbotron.js</a></li>
			   			</ul>
					</li>
					<li><a href="#">cats</a>
						<ul>
							<li><a href="#">index.js</a>
								<ul>
									<li><a href="#">nav.js</a></li>
									<li><a href="#">card.js</a></li>
			   					</ul>
							</li>
							<li><a href="#">[id].js</a></li>
			   			</ul>
					</li>
				</ul>
			</li>
			</ul>
		  </div>
		  <script src="${scriptUri}"></script>
			</body>
			</html>`;
	}
}

export function deactivate() {}
