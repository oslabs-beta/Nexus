var PARSER = require('acorn').Parser;
var jsx = require('acorn-jsx');
var JSXPARSER = PARSER.extend(jsx());
var fs = require('fs');
var path = require('path');
var source = fs.readFileSync(path.resolve(__dirname, './App.jsx'));
var parsed = JSXPARSER.parse(source, { sourceType: "module" });
// console.log(parsed); // -> Program Node {type, start, end, body[]}
var programBody = parsed.body; // get body of Program Node
// some logic that will help filter out nodes that we actually need
// use a switch statement to avoid too many if conditional statements
function switchConditional(expression) {
    // switch(expression){
    //     case 
    // }
}
function findReturnedComponents(arr) {
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
var JSXTEXT = 'JSXText';
var JSXELEMENT = 'JSXElement';
var JSXEXPRESSIONCONTAINER = 'JSXExpressionContainer';
// findPropsChild(arr: Array<any>){
// }
var importNodes = programBody.filter(function (node) { return node.type === 'ImportDeclaration'; });
var otherNodes = programBody.filter(function (node) { return node.type !== 'ImportDeclaration'; });
var variableNodes = programBody.filter(function (node) { return node.type === 'VariableDeclaration'; });
// find export default declaration to get entire component
var exportDefaultNode = otherNodes.filter(function (node) {
    node.type === 'ExportDefaultDeclaration';
})[0];
var returnChildren = variableNodes[variableNodes.length - 1].declarations[0].init.body.body[1].argument.children;
var jsxNodes = returnChildren.filter(function (node) { return node.type === JSXELEMENT; });
for (var _i = 0, jsxNodes_1 = jsxNodes; _i < jsxNodes_1.length; _i++) {
    var node = jsxNodes_1[_i];
    console.log(node);
    var firstChar = node.openingElement.name.name[0]; // actual name label (i.e. 'Chatroom', 'Component')
    if (firstChar === firstChar.toUpperCase()) {
        // console.log(node);
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
