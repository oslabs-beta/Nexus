import * as vscode from 'vscode';
const path = require("path");
const fs = require("fs");
import { NexusProvider } from './NexusProvider';

// activates the extension upon interaction with the sidebar
export function activate(context: vscode.ExtensionContext) {
  const provider = new NexusProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(NexusProvider.viewType, provider)
  );

};