"use strict";
const PARSER = require('acorn').Parser;
const jsx = require('acorn-jsx');
const JSXPARSER = PARSER.extend(jsx());
const fs = require('fs');
const path = require('path');
// CONSTANTS 
const JSXTEXT = 'JSXText';
const JSXELEMENT = 'JSXElement';
const JSXEXPRESSIONCONTAINER = 'JSXExpressionContainer';
class ComponentNode {
    constructor(name, props, children) {
        this.name = name;
        this.children = children;
        this.props = props;
    }
}
// Parser
function getTree(filePath) {
    const source = fs.readFileSync(path.resolve(__dirname, filePath));
    const parsed = JSXPARSER.parse(source, { sourceType: "module" });
    const programBody = parsed.body; // get body of Program Node(i.e. source code entry)
    return programBody;
}
function getImportNodes(programBody) {
    const importNodes = programBody.filter((node) => node.type === 'ImportDeclaration');
    return importNodes;
}
function getVariableNodes(programBody) {
    // const variables that hold different nodes depending on type 
    const variableNodes = programBody.filter((node) => node.type === 'VariableDeclaration');
    return variableNodes;
}
function getOtherNodes(programBody) {
    const otherNodes = programBody.filter((node) => node.type !== 'ImportDeclaration');
    return otherNodes;
}
function getExportDefaultNodes(otherNodes) {
    const exportDefaultNode = otherNodes.filter((node) => {
        node.type === 'ExportDefaultDeclaration';
    })[0];
    return exportDefaultNode;
}
function getChildrenNodes(variableNodes) {
    const childrenNodes = variableNodes[variableNodes.length - 1].declarations[0].init.body.body[1].argument.children;
    return childrenNodes;
}
function getJsxNodes(childrenNodes) {
    const jsxNodes = childrenNodes.filter((node) => node.type === JSXELEMENT);
    return jsxNodes;
}
function getChildrenComponents(jsxNodes) {
    const components = [];
    for (let node of jsxNodes) {
        const firstChar = node.openingElement.name.name[0]; // actual name label (i.e. 'Chatroom', 'Component')
        const componentName = node.openingElement.name.name;
        if (firstChar === firstChar.toUpperCase()) {
            const props = getProps(node);
            // check componentName against importNodes
            // if name matches import node name, take filepath
            // recursively invoke parsing algo on file
            // const children = main(filePath)
            // const componentNode = new ComponentNode(componentName, props, children);
            const componentNode = new ComponentNode(componentName, props, node.children);
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
    const propObj = {};
    for (let prop of node.openingElement.attributes) {
        const name = prop.name.name;
        propObj[name] = getPropValue(prop.value);
        // console.log('propObj', propObj);
    }
    // console.log(propArr);
    return propObj;
}
function main(filePath) {
    const tree = getTree(filePath);
    const importNodes = getImportNodes(tree);
    const variableNodes = getVariableNodes(tree);
    const childrenNodes = getChildrenNodes(variableNodes);
    const jsxNodes = getJsxNodes(childrenNodes);
    const result = getChildrenComponents(jsxNodes);
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
//# sourceMappingURL=parser.js.map