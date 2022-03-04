"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    parseCodeBaseAndSendMessage(filePath) {
        console.log('dirname: ', __dirname);
        console.log('path.resolve: ', path.resolve(__dirname, filePath));
        const resultObj = new parser_js_1.Parser(fs.readFileSync(path.resolve(__dirname, filePath)));
        // const resultObj = new Parser(fs.readFileSync(path.resolve(__dirname, './parser/App.jsx')));
        // const resultObj = new Parser(fs.readFileSync(path.resolve(__dirname, '/Users/davidlee/Nexus/nexus/src/parser/App.jsx')));
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
        console.log('right here dummy: ', process.platform);
        webviewView.webview.onDidReceiveMessage((data) => __awaiter(this, void 0, void 0, function* () {
            // OG File Path = './parser/newApp.jsx'
            switch (data.type) {
                case "addFile": {
                    console.log(data.value);
                    this.parseCodeBaseAndSendMessage(data.value);
                }
            }
        }));
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