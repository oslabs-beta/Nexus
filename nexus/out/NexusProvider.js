"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.NexusProvider = void 0;
const parser_js_1 = require("./parser/parser.js");
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
// class object for webviewView content
class NexusProvider {
    // componentTree: any;
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
        // obj = undefined;
    }
    // function
    // run parser
    // grab data
    // send message to webviewAPI with data using webview.postMessage(data)
    parseCodeBaseAndSendMessage() {
        const resultObj = new parser_js_1.Parser(fs.readFileSync(path.resolve(__dirname, './parser/App.jsx')));
        // const resultObj = new Parser(fs.readFileSync(path.resolve(__dirname, './parser/newApp.jsx')));
        const data = resultObj.main();
        console.log(data);
        console.log('in parse and send message');
        this._view.webview.postMessage(data);
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
exports.NexusProvider = NexusProvider;
NexusProvider.viewType = 'nexus.componentTreeView';
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=NexusProvider.js.map