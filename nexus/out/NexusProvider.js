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
                /*
                        str = path.resolve(filePath.replace(/\\/g, '/'));
                        console.log('wsl str 1: ', str); // ->  /wsl$/Ubuntu-20.04/home/nicoflo/unit-6-react-tic-tac-toe/src/app.jsx
                
                        
                
                        str = '/' + str.split('/').slice(3).join('/');
                        console.log('wsl str 2: ', str); // -> /home/nicoflo/unit-6-react-tic-tac-toe/src/app.jsx
                */
                /*
            
              this.entryFile = '/' + this.entryFile.split('/').slice(3).join('/');
              */
            }
            else {
                str = '/mnt/c/' + filePath.slice(3);
                str = str.replace(/\\/g, '/');
            }
        }
        console.log(str);
        // \\wsl$\
        console.log(path.win32.sep);
        console.log(path.posix.sep);
        const resultObj = new parser_js_1.Parser(fs.readFileSync(str)); // --> works //path.resolve:   
        // const resultObj = new Parser(fs.readFileSync('/mnt/c/Users/Nico/Desktop/nexus-copy/out/parser/App.jsx')); // --> works //path.resolve:   
        // const resultObj = new Parser(fs.readFileSync(path.resolve(__dirname, './parser/App.jsx'))); // -> works      
        // const resultObj = new Parser(fs.readFileSync(path.resolve(__dirname, '/Users/davidlee/Nexus/nexus/src/parser/newApp.jsx'))); // -> works
        const data = resultObj.main();
        console.log('FUNCTIONAL NODES: ', data);
        // debugger terminal - success notification
        console.log('Congratulations, your extension "nexus" is now active!');
        console.log('data from parseCodeBase..', data);
        // console.log('in parse and send message');
        this._view.webview.postMessage({ name: 'App', children: data });
    }
    resolveWebviewView(webviewView) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };
        console.log('process.platform test: ', process.platform);
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