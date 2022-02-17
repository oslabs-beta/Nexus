const PARSER = require('acorn').Parser;
const jsx = require('acorn-jsx');
const JSXPARSER = PARSER.extend(jsx());
const fs = require('fs');
const path = require('path');

interface Node {
  type: string,
  start: number,
  end: number,
  value: any,
  raw: string,
  declarations: Array<Node>,
  declaration: Node,
  properties: Array<Node>,
  method: boolean,
  init: Node,
  body: Array<any>|Object,
  children: Array<Node>,
  argument: Node,
  openingElement: Node
}

const source = fs.readFileSync(path.resolve(__dirname, './App.jsx'));
const parsed = JSXPARSER.parse(source, {sourceType: "module"});
// console.log(parsed); // -> Program Node {type, start, end, body[]}
const programBody: Array<Node> = parsed.body; // get body of Program Node

// some logic that will help filter out nodes that we actually need
    // use a switch statement to avoid too many if conditional statements
function switchConditional(expression:Array<Node>){
    // switch(expression){
    //     case 
    // }
}

function findReturnedComponents(arr: Array<Node>) {
  // loop through all
  // look inside each node to see if it returns jsxcomponents
    // look inside declarations property of node
    // get id property <Node>
    // get init property <Node>
    // get body.body of init
    // get node with type === 'ReturnStatement'
    // with return statement node
    // argument.children
      // -> array<Node> of different JSX types
      // with helper function, loop through to find actual jsx components
    // findProps()
  // if it does, do something 
}

const JSXTEXT: string = 'JSXText';
const JSXELEMENT: string = 'JSXElement';
const JSXEXPRESSIONCONTAINER: string = 'JSXExpressionContainer';


// findPropsChild(arr: Array<any>){
    
// }

const importNodes: Array<Node> = programBody.filter((node: Node) => node.type === 'ImportDeclaration');
const otherNodes: Array<Node> = programBody.filter((node: Node) => node.type !== 'ImportDeclaration');
const variableNodes: Array<Node> = programBody.filter((node: Node) => node.type === 'VariableDeclaration');
// find export default declaration to get entire component
const exportDefaultNode: Node = otherNodes.filter((node: Node) => {
  node.type === 'ExportDefaultDeclaration';
})[0];

const returnChildren = variableNodes[variableNodes.length-1].declarations[0].init.body.body[1].argument.children;
const jsxNodes: Array<Node> = returnChildren.filter((node: Node) => node.type === JSXELEMENT);
for (let node of jsxNodes) {
  const firstChar = node.openingElement.name.name[0]; // actual name label (i.e. 'Chatroom', 'Component')
  if(firstChar === firstChar.toUpperCase()){
    console.log(node);
  }
}
// console.log(exportDefaultNode.declaration.properties);

// iterate through other nodes to find children components
// othernodes -> find type: VariableDeclaration where there is return statement


// console.log(parsed.body[5].declarations[0].init.body.body[1].argument.children[1].openingElement.attributes[0].value);
// console.log(parsed.body.filter(node => node.type !== 'ImportDeclaration'));

// function nodeFinder(array: Array<Node>) {
//   for (let i = 0; i < array.length; i++) {
//     console.log(array[i]);
//     // if node is returning components
//     // check component against importNodes and recursively call with component file
//     // and render visualizer
//   }
// }


// nodeFinder(allNodes);
// console.log(importNodes);
// console.log(allNodes[allNodes.length-2].declarations[0].init.body.body[1].argument.children[5].openingElement.attributes[1].value);
// console.log(allNodes[allNodes.length-2].declarations[0].init.body.body[1].argument);