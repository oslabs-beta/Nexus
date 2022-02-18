var PARSER = require('acorn').Parser;
var jsx = require('acorn-jsx');
var JSXPARSER = PARSER.extend(jsx());
var fs = require('fs');
var path = require('path');
// CONSTANTS 
var JSXTEXT = 'JSXText';
var JSXELEMENT = 'JSXElement';
var JSXEXPRESSIONCONTAINER = 'JSXExpressionContainer';
var ComponentNode = /** @class */ (function () {
    function ComponentNode(name, props, children) {
        this.name = name;
        this.children = children;
        this.props = props;
    }
    return ComponentNode;
}());
var PropsNode = /** @class */ (function () {
    function PropsNode(name, value) {
        this.name = name;
        this.value = value;
    }
    return PropsNode;
}());
// Parser
var source = fs.readFileSync(path.resolve(__dirname, './App.jsx'));
var parsed = JSXPARSER.parse(source, { sourceType: "module" });
var programBody = parsed.body; // get body of Program Node(i.e. source code entry)
// const variables that hold different nodes depending on type 
var importNodes = programBody.filter(function (node) { return node.type === 'ImportDeclaration'; });
var otherNodes = programBody.filter(function (node) { return node.type !== 'ImportDeclaration'; });
var variableNodes = programBody.filter(function (node) { return node.type === 'VariableDeclaration'; });
// find export default declaration to get entire component
var exportDefaultNode = otherNodes.filter(function (node) {
    node.type === 'ExportDefaultDeclaration';
})[0];
var returnChildren = variableNodes[variableNodes.length - 1].declarations[0].init.body.body[1].argument.children;
var jsxNodes = returnChildren.filter(function (node) { return node.type === JSXELEMENT; });
var components = [];
for (var _i = 0, jsxNodes_1 = jsxNodes; _i < jsxNodes_1.length; _i++) {
    var node = jsxNodes_1[_i];
    var firstChar = node.openingElement.name.name[0]; // actual name label (i.e. 'Chatroom', 'Component')
    if (firstChar === firstChar.toUpperCase()) {
        var componentNode = new ComponentNode(node.openingElement.name.name, node.children);
        // newNode.name = node.openingElement.name.name;
        // newNode.props = findProps(node);
        // newNode.children = node.children;
        var props = getNodeProps(node);
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
function getPropValue(node) {
    if (Object.keys(node).includes('expression')) {
        return node.expression.value; // look into the value (node) and find the expression 
    }
    else {
        return node.value; // return the value 
    }
}
function getNodeProps(node) {
    var propArr = [];
    for (var _i = 0, _a = node.openingElement.attributes; _i < _a.length; _i++) {
        var prop = _a[_i];
        var newProps = new PropsNode(prop.name.name, getPropValue(prop.value));
        propArr.push(newProps);
    }
    // console.log(propArr);
    return propArr;
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
