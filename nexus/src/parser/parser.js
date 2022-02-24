"use strict";
// const PARSER = require('acorn').Parser;
exports.__esModule = true;
var parserModule = require("acorn");
var PARSER = parserModule.Parser;
// const jsx = require('acorn-jsx');
var jsx = require("acorn-jsx");
var JSXPARSER = PARSER.extend(jsx());
var fs = require("fs");
var path = require("path");
// const fs = require("fs");
// const path = require("path");
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
// Parser
function getTree(filePath) {
    var source = fs.readFileSync(path.resolve(__dirname, filePath));
    var parsed = JSXPARSER.parse(source, { sourceType: "module" });
    var programBody = parsed.body; // get body of Program Node(i.e. source code entry)
    return programBody;
}
function getImportNodes(programBody) {
    var importNodes = programBody.filter(function (node) { return node.type === 'ImportDeclaration'; });
    return importNodes;
}
function getVariableNodes(programBody) {
    // CHECK if functional or class component
    //   const checkFunctionalOrClass = (programBody: Array<Node>)=>{
    //     // return 'functional' if functional, 'class' if class component
    //     for(let i=0;i<programBody.length;i++){
    //       if(programBody[i].type === 'VariableDeclaration'){
    //         return 'functional';
    //       }else if(programBody[i].type === 'ClassDeclaration'){
    //         return 'class';
    //       }
    //     }
    //   };
    //   if (checkFunctionalOrClass(programBody) === 'functional') {
    //     const variableNodes: Array<Node> = programBody.filter((node: Node) => node.type === 'VariableDeclaration');
    //     return variableNodes;
    //   } else {
    //     // class logic
    //     const variableNodes: Array<Node> = programBody.filter((node: Node) => node.type === 'ClassDeclaration');
    //     return variableNodes;
    //   }
    // }
    // return variableNodes;
    // return getVariableNodes;
    var variableNodes = programBody.filter(function (node) { return node.type === 'VariableDeclaration'; });
    return variableNodes;
}
function getNonImportNodes(programBody) {
    var nonImportNodes = programBody.filter(function (node) { return node.type !== 'ImportDeclaration'; });
    return nonImportNodes;
}
function getExportDefaultNodes(otherNodes) {
    var exportDefaultNode = otherNodes.filter(function (node) {
        node.type === 'ExportDefaultDeclaration';
    })[0];
    return exportDefaultNode;
}
function getChildrenNodes(variableNodes) {
    // RETURN STATEMENT in functional component
    var nodes = variableNodes[variableNodes.length - 1].declarations[0].init.body.body;
    var returnNode = nodes.filter(function (node) { return node.type === 'ReturnStatement'; })[0];
    var childrenNodes = returnNode.argument.children;
    return childrenNodes;
}
function getJsxNodes(childrenNodes) {
    var jsxNodes = childrenNodes.filter(function (node) { return node.type === JSXELEMENT; });
    return jsxNodes;
}
function getChildrenComponents(jsxNodes, importNodes) {
    var components = [];
    var regex = /[a-zA-Z]+(.jsx|.js)/;
    var importValues = importNodes.map(function (node) { return node.source.value; });
    var componentPaths = importValues.filter(function (str) { return regex.test(str) === true; });
    var cache = {};
    for (var _i = 0, componentPaths_1 = componentPaths; _i < componentPaths_1.length; _i++) {
        var str = componentPaths_1[_i];
        var splitName = str.split('/');
        var componentPath = splitName[splitName.length - 1];
        var name_1 = componentPath.split('.')[0];
        cache[name_1] = str;
    }
    console.log('Cache', cache);
    // importValues = ['./Children.jsx', 'react', 'react-router-dom']
    for (var _a = 0, jsxNodes_1 = jsxNodes; _a < jsxNodes_1.length; _a++) {
        var node = jsxNodes_1[_a];
        var firstChar = node.openingElement.name.name[0]; // actual name label (i.e. 'Chatroom', 'Component')
        var componentName = node.openingElement.name.name;
        if (firstChar === firstChar.toUpperCase()) {
            var props = getProps(node);
            // check componentName against importNodes
            // if name matches import node name, take filepath
            // recursively invoke parsing algo on file
            var children = [];
            if (cache["" + componentName]) {
                children = main(cache["" + componentName]);
            }
            var componentNode = new ComponentNode(componentName, props, children);
            components.push(componentNode);
        }
    }
    return components;
}
function getPropValue(node) {
    if (Object.keys(node).includes('expression')) {
        return node.expression.value; // look into the value (node) and find the expression 
    }
    else {
        return node.value; // return the value 
    }
}
function getProps(node) {
    var propObj = {};
    for (var _i = 0, _a = node.openingElement.attributes; _i < _a.length; _i++) {
        var prop = _a[_i];
        var name_2 = prop.name.name;
        propObj[name_2] = getPropValue(prop.value);
        // console.log('propObj', propObj);
    }
    // console.log(propArr);
    return propObj;
}
function main(filePath) {
    // console.log(filePath);
    var tree = getTree(filePath);
    // console.log(tree);
    var importNodes = getImportNodes(tree);
    var variableNodes = getVariableNodes(tree);
    var childrenNodes = getChildrenNodes(variableNodes);
    var jsxNodes = getJsxNodes(childrenNodes);
    var result = getChildrenComponents(jsxNodes, importNodes);
    console.log(result);
    return result;
}
exports["default"] = main;
// main('./App.jsx');
// main('./newApp.jsx');
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
