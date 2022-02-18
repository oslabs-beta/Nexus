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
    // const variables that hold different nodes depending on type 
    var variableNodes = programBody.filter(function (node) { return node.type === 'VariableDeclaration'; });
    return variableNodes;
}
function getOtherNodes(programBody) {
    var otherNodes = programBody.filter(function (node) { return node.type !== 'ImportDeclaration'; });
    return otherNodes;
}
function getExportDefaultNodes(otherNodes) {
    var exportDefaultNode = otherNodes.filter(function (node) {
        node.type === 'ExportDefaultDeclaration';
    })[0];
    return exportDefaultNode;
}
function getChildrenNodes(variableNodes) {
    var childrenNodes = variableNodes[variableNodes.length - 1].declarations[0].init.body.body[1].argument.children;
    return childrenNodes;
}
function getJsxNodes(childrenNodes) {
    var jsxNodes = childrenNodes.filter(function (node) { return node.type === JSXELEMENT; });
    return jsxNodes;
}
function getChildrenComponents(jsxNodes) {
    var components = [];
    for (var _i = 0, jsxNodes_1 = jsxNodes; _i < jsxNodes_1.length; _i++) {
        var node = jsxNodes_1[_i];
        var firstChar = node.openingElement.name.name[0]; // actual name label (i.e. 'Chatroom', 'Component')
        var componentName = node.openingElement.name.name;
        if (firstChar === firstChar.toUpperCase()) {
            var props = getProps(node);
            // check componentName against importNodes
            // if name matches import node name, take filepath
            // recursively invoke parsing algo on file
            // const children = main(filePath)
            // const componentNode = new ComponentNode(componentName, props, children);
            var componentNode = new ComponentNode(componentName, props, node.children);
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
        var name_1 = prop.name.name;
        propObj[name_1] = getPropValue(prop.value);
        // console.log('propObj', propObj);
    }
    // console.log(propArr);
    return propObj;
}
function main(filePath) {
    var tree = getTree(filePath);
    var importNodes = getImportNodes(tree);
    var variableNodes = getVariableNodes(tree);
    var childrenNodes = getChildrenNodes(variableNodes);
    var jsxNodes = getJsxNodes(childrenNodes);
    var result = getChildrenComponents(jsxNodes);
    console.log(result);
    return result;
}
main('./App.jsx');
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
