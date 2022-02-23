// const PARSER = require('acorn').Parser;
// import * as parserModule from 'acorn';
// const PARSER = parserModule.Parser;
// // const jsx = require('acorn-jsx');
// import * as jsx from 'acorn-jsx';
// const JSXPARSER = PARSER.extend(jsx());
// import * as fs from 'fs';
// import * as path from 'path';
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
    const variableNodes = programBody.filter((node) => node.type === 'VariableDeclaration');
    return variableNodes;
}
function getNonImportNodes(programBody) {
    const nonImportNodes = programBody.filter((node) => node.type !== 'ImportDeclaration');
    return nonImportNodes;
}
function getExportDefaultNodes(otherNodes) {
    const exportDefaultNode = otherNodes.filter((node) => {
        node.type === 'ExportDefaultDeclaration';
    })[0];
    return exportDefaultNode;
}
function getChildrenNodes(variableNodes) {
    // RETURN STATEMENT in functional component
    const nodes = variableNodes[variableNodes.length - 1].declarations[0].init.body.body;
    const returnNode = nodes.filter((node) => node.type === 'ReturnStatement')[0];
    const childrenNodes = returnNode.argument.children;
    return childrenNodes;
}
function getJsxNodes(childrenNodes) {
    const jsxNodes = childrenNodes.filter((node) => node.type === JSXELEMENT);
    return jsxNodes;
}
function getChildrenComponents(jsxNodes, importNodes) {
    const components = [];
    const regex = /[a-zA-Z]+(.jsx|.js)/;
    const importValues = importNodes.map((node) => node.source.value);
    const componentPaths = importValues.filter((str) => regex.test(str) === true);
    const cache = {};
    for (let str of componentPaths) {
        const splitName = str.split('/');
        const componentPath = splitName[splitName.length - 1];
        const name = componentPath.split('.')[0];
        cache[name] = str;
    }
    console.log('Cache', cache);
    // importValues = ['./Children.jsx', 'react', 'react-router-dom']
    for (let node of jsxNodes) {
        const firstChar = node.openingElement.name.name[0]; // actual name label (i.e. 'Chatroom', 'Component')
        const componentName = node.openingElement.name.name;
        if (firstChar === firstChar.toUpperCase()) {
            const props = getProps(node);
            // check componentName against importNodes
            // if name matches import node name, take filepath
            // recursively invoke parsing algo on file
            let children = [];
            if (cache[`${componentName}`]) {
                children = main(cache[`${componentName}`]);
            }
            const componentNode = new ComponentNode(componentName, props, children);
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
    // console.log(filePath);
    const tree = getTree(filePath);
    // console.log(tree);
    const importNodes = getImportNodes(tree);
    const variableNodes = getVariableNodes(tree);
    const childrenNodes = getChildrenNodes(variableNodes);
    const jsxNodes = getJsxNodes(childrenNodes);
    const result = getChildrenComponents(jsxNodes, importNodes);
    console.log(result);
    return result;
}
module.exports = main;
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
//# sourceMappingURL=parser.js.map