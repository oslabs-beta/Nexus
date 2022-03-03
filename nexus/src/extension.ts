import * as vscode from 'vscode';
import { Parser } from './parser/parser.js';
const path = require("path");
const fs = require("fs");


export function activate(context: vscode.ExtensionContext) {

  const provider = new NexusProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(NexusProvider.viewType, provider)
  );

  // register parse command
  let parsePush = vscode.commands.registerCommand('nexus.parseCode', (webviewView: vscode.WebviewView) => {
    // console.log(webviewView);
    console.log('within parsePush command');
    provider.parseCodeBaseAndSendMessage();

  });

  context.subscriptions.push(parsePush);

  // debugger terminal - success notification
  console.log('Congratulations, your extension "nexus" is now active!');

  // function readFile (){fs.readFileSync()}

  // const resultObj = new Parser(fs.readFileSync(path.resolve(__dirname, './parser/newApp.jsx')));
  // console.log(resultObj.main());

  // let classObj = resultObj.programBody.filter(node=>{
  //   return node.type === 'ClassDeclaration';
  // })
  // console.log(classObj[0]);
  // console.log(classObj[0].body.body[1].value.body.body[0].argument.openingElement.name.name);//.body[1].value.body.body[0].argument.openingElement.name.name);**
  // filter all class declarations (like above)
  // for each class declaration node, look at body.body (Array)

  
    // for(let i=0;i<classObj.length;i++){
    //   for(let j=0;j<classObj[i].body.body.length;j++){
    //     console.log(classObj[i].body.body[j]);
    //     if(classObj[i].body.body[j].key.name === 'render'){
    //       console.log('it works!' , classObj[i].body.body[j].value.body.body[0].argument.openingElement.name.name);
    //     }
    //   }
    // }

  // iterate through body.body, looking at all methodDefinitions
    // if .key.name === "render", use that class node
    // else continue 
}

// class object for webviewView content
class NexusProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  public static readonly viewType = 'nexus.componentTreeView';
  // componentTree: any;
  constructor(private readonly _extensionUri: vscode.Uri) {
    // obj = undefined;
   
  }

  // function
    // run parser
      // grab data
        // send message to webviewAPI with data using webview.postMessage(data)
  
  public parseCodeBaseAndSendMessage() {

    const resultObj = new Parser(fs.readFileSync(path.resolve(__dirname, './parser/App.jsx')));
    // const resultObj = new Parser(fs.readFileSync(path.resolve(__dirname, './parser/newApp.jsx')));
    const data = resultObj.main();
    console.log(data);

    console.log('in parse and send message');
    this._view.webview.postMessage(data);
  }
  
  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;
    
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };
    
    // obj = parser('./parser/App.jsx');
    // this.parseCodeBaseAndSendMessage(this._view);
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  _getHtmlForWebview(webview: vscode.Webview) {
    console.log('running gethtmlforwebview');
    // const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist', 'sidebar.js')
      );
      const styles = webview.asWebviewUri(
        vscode.Uri.joinPath(this._extensionUri, 'media', 'styles.css')
        );
        
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
    export function deactivate() {}
    // const dummyData = 
    // {
    //   name: 'App',
    //   props: { example: 'test' },
    //   children: [{ name: 'Thick Colonoscopy Bag Alex', props: { price: 'Alex Compoment Props' },
    //     children: [
    //       { name: 'Power Tripping Simp Nico - Sib to Brian', props: { price: 'Simp Component Props' },
    //     children: [{ name: 'Closet Furry Mike - Child of Brian', props: { price: 'Furry Component Props' },
    //     children: [] }]},
    //       { name: 'Kim Jong Brian - Sib to Nico', props: { price: 'Kim Jong Brian Props' },
    //         children: []
    //         }
    //       ]
  
    // },
    //     { name: 'Gross Poopy Diaper David', props: { price: 'David Component Props' },  children: [] }
    //   ],
    // };
    
    
    
    
    
    //______________________NICOOOOO_______________
    // console.log('pls work! ', obj);
    //     const bodyEnd = `</ul>
    //   </li>
    // </ul>`;
    //     let body = `
    // <ul class="root-tree">
    // <li><span class="tree" id="main-app-root">App</span>
    //   <ul class="subtree">
    // `;
    // for (let i = 0; i < obj.length; i++) {
    //   if (obj[i]['children'].length > 0) {
    //     body += `<li><span class="tree">${obj[i]['name']}</span>`;
    //   } else {
    //     body += `<li class="top-level-tree">${obj[i]['name']}`;
    //   }
    //   if (obj[i]['children'].length > 0) {
    //     body += `<ul class="subtree" id='subtree'>`;
    //     for (let j = 0; j < obj[i]['children'].length; j++) {
    //       body += `<li class="third-level">${obj[i]['children'][j]['name']}</li>`;
    //     }
    //     body += `</ul></li>`;
    //   } else {
    //     body += `</li>`;
    //   }
    // }
    // body += bodyEnd;

    // props
    // iterate through the array of nodes that is returned from the parser
    // if the length of the value of the props property inside each object is greater than zero
    // list out the propsin a list
    // for (let i = 0; i < obj.length; i++) {
    //   if (obj[i]['props'].length > 0) {
    //   }
    // }
    // console.log(body);
/*
<ul class="root-tree">
  <li><span class="tree">pages</span>
    <ul class="subtree">
      <li>_app.js</li>
      <li><span class="tree">index.js</span>
		  <ul class="subtree">
		  <li>nav.js</li>
		  <li>jumbotron.js</li>
		  </ul>
	  </li>
	  <li><span class="tree">cats</span>
	  	<ul class="subtree">
	  	<li><span class="tree">index.js</span>
		  <ul class="subtree">
		  <li>nav.js</li>
		  <li>card.js</li>
		  </ul>
		</li>
		<li>[id].js</li>
		</ul>
      </li>  
    </ul>
  </li>
</ul>
*/
