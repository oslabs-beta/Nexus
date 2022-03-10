"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const NexusProvider_1 = require("./NexusProvider");
function activate(context) {
    const provider = new NexusProvider_1.NexusProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(NexusProvider_1.NexusProvider.viewType, provider));
    // let parsePush = vscode.commands.registerCommand('nexus.parseCode', (webviewView: vscode.WebviewView) => {
    //   // console.log(webviewView);
    //   console.log('within parsePush command');
    //   provider.parseCodeBaseAndSendMessage();
    // });
    // context.subscriptions.push(parsePush);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map