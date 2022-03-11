"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const NexusProvider_1 = require("./NexusProvider");
// activates the extension upon interaction with the sidebar
function activate(context) {
    const provider = new NexusProvider_1.NexusProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(NexusProvider_1.NexusProvider.viewType, provider));
}
exports.activate = activate;
;
//# sourceMappingURL=extension.js.map