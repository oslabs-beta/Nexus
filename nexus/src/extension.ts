import * as vscode from 'vscode';
import { Parser } from './parser/parser.js';
const path = require("path");
const fs = require("fs");
import { NexusProvider } from './NexusProvider';

export function activate(context: vscode.ExtensionContext) {

  const provider = new NexusProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(NexusProvider.viewType, provider)
  );

  // context.subscriptions.push(
  //   vscode.window.registerWebviewViewProvider('nexus.addFileButton', provider)
  // );

  // register parse command
  let parsePush = vscode.commands.registerCommand('nexus.parseCode', (webviewView: vscode.WebviewView) => {
    // console.log(webviewView);
    console.log('within parsePush command');
    provider.parseCodeBaseAndSendMessage();
  });


  
  context.subscriptions.push(parsePush);
  
}
 