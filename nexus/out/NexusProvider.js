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
const ReactParser_js_1 = require("./parser/ReactParser.js");
const NextParser_js_1 = require("./parser/NextParser.js");
const vscode = require("vscode");
const path = require('path');
const fs = require('fs');
// class object for webviewView content
class NexusProvider {
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    // send message to webviewAPI with data using webview.postMessage(data)
    parseCodeBaseAndSendMessage(filePath) {
        let str = filePath;
        // allows for multi-platform compatability (Linux, Mac, etc.)
        if (process.platform === 'linux') {
            if (/wsl\$/.test(filePath)) {
                str = '/home' + filePath.split('home')[1].replace(/\\/g, '/');
            }
            else {
                str = '/mnt/c/' + filePath.slice(3);
                str = str.replace(/\\/g, '/');
            }
        }
        let resultObj;
        // if file is ending in '.js', send it into the Next.Js parser route
        if (str.slice(-3) === '.js') {
            resultObj = new NextParser_js_1.NextParser(fs.readFileSync(str), str);
        }
        // otherwise, send the file through the React parser route
        else {
            resultObj = new ReactParser_js_1.ReactParser(fs.readFileSync(str));
        }
        // pull the parsed object from the parser, to be sent to the front-end
        const data = resultObj.main();
        console.log('Congratulations, your extension "nexus" is now active!');
        this._view.webview.postMessage({ name: 'App', children: data });
    }
    // stage the initial html elements to the VSCode WebviewView
    resolveWebviewView(webviewView) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };
        webviewView.webview.onDidReceiveMessage((data) => __awaiter(this, void 0, void 0, function* () {
            switch (data.type) {
                case 'addFile': {
                    this.parseCodeBaseAndSendMessage(data.value);
                }
            }
        }));
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    }
    _getHtmlForWebview(webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'sidebar.js'));
        const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'styles.css'));
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
exports.NexusProvider = NexusProvider;
NexusProvider.viewType = 'nexus.componentTreeView';
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=NexusProvider.js.map