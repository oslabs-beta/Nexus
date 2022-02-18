const PARSER = require('acorn').Parser;
const jsx = require('acorn-jsx');
const JSXPARSER = PARSER.extend(jsx());
const fs = require('fs');
const path = require('path');

// CONSTANTS 
const JSXTEXT: string = 'JSXText';
const JSXELEMENT: string = 'JSXElement';
const JSXEXPRESSIONCONTAINER: string = 'JSXExpressionContainer';

// TS Interface
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
  body: Array<any>|object,
  children: Array<Node>,
  argument: Node,
  openingElement: Node,
  name: Node|string,
  attributes: Array<Node>,
  props: Node,
  expression: Node,
}

interface ComponentNode {
  name: string,
  children: Array<any>,
  props: Array<PropsNode>
}

class ComponentNode {
  constructor(name: string, props: Array<PropsNode>, children: Array<any>) {
    this.name = name;
    this.children = children;
    this.props = props;
  }
}

interface PropsNode {
  props: Node,
  name: String,
  value: any,
}

class PropsNode {
  constructor(name:String,value:any){
    this.name = name;
    this.value = value;
  }
}
// Parser
const source = fs.readFileSync(path.resolve(__dirname, './App.jsx'));
const parsed = JSXPARSER.parse(source, {sourceType: "module"}); 
const programBody: Array<Node> = parsed.body; // get body of Program Node(i.e. source code entry)

// const variables that hold different nodes depending on type 
const importNodes: Array<Node> = programBody.filter((node: Node) => node.type === 'ImportDeclaration');
const otherNodes: Array<Node> = programBody.filter((node: Node) => node.type !== 'ImportDeclaration');
const variableNodes: Array<Node> = programBody.filter((node: Node) => node.type === 'VariableDeclaration');


// find export default declaration to get entire component
const exportDefaultNode: Node = otherNodes.filter((node: Node) => {
  node.type === 'ExportDefaultDeclaration';
})[0];

const returnChildren = variableNodes[variableNodes.length-1].declarations[0].init.body.body[1].argument.children;
const jsxNodes: Array<Node> = returnChildren.filter((node: Node) => node.type === JSXELEMENT);


const components = [];
for (let node of jsxNodes) {
  const firstChar = node.openingElement.name.name[0]; // actual name label (i.e. 'Chatroom', 'Component')
  if (firstChar === firstChar.toUpperCase()) {
    const componentNode = new ComponentNode(node.openingElement.name.name, node.children);
    // newNode.name = node.openingElement.name.name;
    // newNode.props = findProps(node);
    // newNode.children = node.children;
    const props = getNodeProps(node);
    componentNode.props = props;
    components.push(componentNode);
    // get name of component, props, children<boolean>
    // console.log(node);
    
  }
}
console.log(components);
// Node {
//   type: 'JSXElement',
//   start: 815,
//   end: 857,
//   openingElement: Node {
//     type: 'JSXOpeningElement',
//     start: 815,
//     end: 857,
//     attributes: [ [Node], [Node] ],
//     name: Node {
//       type: 'JSXIdentifier',
//       start: 816,
//       end: 825,
//       name: 'Chatrooms'
//     },
//     selfClosing: true
//   },
//   closingElement: null,
//   children: []
// }
// some logic that will help filter out nodes that we actually need
    // use a switch statement to avoid too many if conditional statements
// <Chatroom name={'Brian'} otherProp={500}/>

// value: Node {
//   type: 'Literal',
//   start: 650,
//   end: 657,
//   value: '/dogs',
//   raw: '"/dogs"'
// }

// value: Node {
//   type: 'JSXExpressionContainer',
//   start: 775,
//   end: 784,
//   expression: [Node]
// }

function getPropValue(node: Node) {
  if (Object.keys(node).includes('expression')) {
    return node.expression.value; // look into the value (node) and find the expression 
  } else {
    return node.value; // return the value 
  }
}

function getNodeProps(node:Node){
  const propArr: Array<any> = [];
  for(let prop of node.openingElement.attributes){
    const newProps = new PropsNode(prop.name.name, getPropValue(prop.value));
    propArr.push(newProps);
  }
  // console.log(propArr);
  return propArr;
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



// findPropsChild(arr: Array<any>){
    
// }


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