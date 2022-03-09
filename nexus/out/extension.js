"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    // webviewView
    const provider = new ColorsViewProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(ColorsViewProvider.viewType, provider));
    // webview
    let openWebview = vscode.commands.registerCommand('exampleApp.openWebview', () => {
        const panel = vscode.window.createWebviewPanel('Big Chungus', 'Big Chungus', vscode.ViewColumn.One, {
            enableScripts: true
        });
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
exports.activate = activate;
//# sourceMappingURL=extension.js.map