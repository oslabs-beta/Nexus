"use strict";
// const PARSER = require('acorn').Parser;
exports.__esModule = true;
var parserModule = require("acorn");
var PARSER = parserModule.Parser;
// const jsx = require('acorn-jsx');
var jsx = require("acorn-jsx");
var JSXPARSER = PARSER.extend(jsx());
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
var Parser = /** @class */ (function () {
    function Parser(sourceCode) {
        this.program = JSXPARSER.parse(sourceCode, { sourceType: "module" }); // Node Object -> take body property (Array)
        this.programBody = this.program.body;
    }
    //methods
    Parser.prototype.getImportNodes = function (programBody) {
        var importNodes = programBody.filter(function (node) { return node.type === 'ImportDeclaration'; });
        return importNodes;
    };
    Parser.prototype.getVariableNodes = function (programBody) {
        var variableNodes = programBody.filter(function (node) { return node.type === 'VariableDeclaration'; });
        return variableNodes;
    };
    Parser.prototype.getNonImportNodes = function (programBody) {
        var nonImportNodes = programBody.filter(function (node) { return node.type !== 'ImportDeclaration'; });
        return nonImportNodes;
    };
    Parser.prototype.getExportDefaultNodes = function (otherNodes) {
        var exportDefaultNode = otherNodes.filter(function (node) {
            node.type === 'ExportDefaultDeclaration';
        })[0];
        return exportDefaultNode;
    };
    Parser.prototype.getChildrenNodes = function (variableNodes) {
        // RETURN STATEMENT in functional component
        var nodes = variableNodes[variableNodes.length - 1].declarations[0].init.body.body;
        var returnNode = nodes.filter(function (node) { return node.type === 'ReturnStatement'; })[0];
        var childrenNodes = returnNode.argument.children;
        return childrenNodes;
    };
    Parser.prototype.getJsxNodes = function (childrenNodes) {
        var jsxNodes = childrenNodes.filter(function (node) { return node.type === JSXELEMENT; });
        return jsxNodes;
    };
    Parser.prototype.getChildrenComponents = function (jsxNodes, importNodes) {
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
        // console.log('Cache', cache);
        // importValues = ['./Children.jsx', 'react', 'react-router-dom']
        for (var _a = 0, jsxNodes_1 = jsxNodes; _a < jsxNodes_1.length; _a++) {
            var node = jsxNodes_1[_a];
            var firstChar = node.openingElement.name.name[0]; // actual name label (i.e. 'Chatroom', 'Component')
            var componentName = node.openingElement.name.name;
            if (firstChar === firstChar.toUpperCase()) {
                var props = this.getProps(node);
                // check componentName against importNodes
                // if name matches import node name, take filepath
                // recursively invoke parsing algo on file
                var children = [];
                if (cache["" + componentName]) {
                    // children = main(cache[`${componentName}`]);
                }
                var componentNode = new ComponentNode(componentName, props, []);
                // const componentNode = new ComponentNode(componentName, props, children);
                components.push(componentNode);
            }
        }
        return components;
    };
    Parser.prototype.getPropValue = function (node) {
        if (Object.keys(node).includes('expression')) {
            return node.expression.value; // look into the value (node) and find the expression 
        }
        else {
            return node.value; // return the value 
        }
    };
    Parser.prototype.getProps = function (node) {
        var propObj = {};
        for (var _i = 0, _a = node.openingElement.attributes; _i < _a.length; _i++) {
            var prop = _a[_i];
            var name_2 = prop.name.name;
            propObj[name_2] = this.getPropValue(prop.value);
            // console.log('propObj', propObj);
        }
        // console.log(propArr);
        return propObj;
    };
    Parser.prototype.main = function (filePath) {
        // console.log(filePath);
        var importNodes = this.getImportNodes(this.programBody);
        var variableNodes = this.getVariableNodes(this.programBody);
        var childrenNodes = this.getChildrenNodes(variableNodes);
        var jsxNodes = this.getJsxNodes(childrenNodes);
        var result = this.getChildrenComponents(jsxNodes, importNodes);
        // console.log(result);
        return result;
    };
    return Parser;
}());
exports.Parser = Parser;
/*

function getTree(filePath: string){
  const source = fs.readFileSync(path.resolve(__dirname, filePath));
  const parsed = JSXPARSER.parse(source, {sourceType: "module"});
  console.log('parsed: ', parsed);
  const programBody: Array<Node> = parsed.body; // get body of Program Node(i.e. source code entry)
  console.log('programBody: ', programBody);
  return programBody;
}

function getImportNodes(programBody: Array<Node>) {
  const importNodes: Array<Node> = programBody.filter((node: Node) => node.type === 'ImportDeclaration');
  return importNodes;
}
function getVariableNodes(programBody: Array<Node>) {
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
  const variableNodes: Array<Node> = programBody.filter((node: Node) => node.type === 'VariableDeclaration');
  return variableNodes;
}
function getNonImportNodes(programBody: Array<any>) {
  const nonImportNodes: Array<Node> = programBody.filter((node: Node) => node.type !== 'ImportDeclaration');
  return nonImportNodes;
}
function getExportDefaultNodes(otherNodes: Array<any>) {
  const exportDefaultNode: Node = otherNodes.filter((node: Node) => {
  node.type === 'ExportDefaultDeclaration';
  })[0];
  return exportDefaultNode;
}

function getChildrenNodes(variableNodes: Array<Node>) {
  // RETURN STATEMENT in functional component
  const nodes = variableNodes[variableNodes.length-1].declarations[0].init.body.body;
  const returnNode = nodes.filter((node) => node.type === 'ReturnStatement')[0];
  const childrenNodes = returnNode.argument.children;
  return childrenNodes;
}

function getJsxNodes(childrenNodes: Array<Node>) {
  const jsxNodes: Array<Node> = childrenNodes.filter((node: Node) => node.type === JSXELEMENT);
  return jsxNodes;
}

function getChildrenComponents(jsxNodes: Array<Node>, importNodes: Array<Node>) {
  const components = [];
  const regex = /[a-zA-Z]+(.jsx|.js)/;
  const importValues = importNodes.map((node) => node.source.value);
  const componentPaths = importValues.filter((str) => regex.test(str) === true);
  const cache = {};
  for (let str of componentPaths) {
    const splitName = str.split('/');
    const componentPath = splitName[splitName.length-1];
    const name = componentPath.split('.')[0];
    cache[name] = str;
  }
  // console.log('Cache', cache);
  
  // importValues = ['./Children.jsx', 'react', 'react-router-dom']
  for (let node of jsxNodes) {
    const firstChar = node.openingElement.name.name[0]; // actual name label (i.e. 'Chatroom', 'Component')
    const componentName = node.openingElement.name.name;
    if (firstChar === firstChar.toUpperCase()) {
      const props = getProps(node);
      // check componentName against importNodes
      // if name matches import node name, take filepath
      // recursively invoke parsing algo on file
      let children: Array<ComponentNode> = [];
      if (cache[`${componentName}`]) {
        // children = main(cache[`${componentName}`]);
      }
      
      const componentNode = new ComponentNode(componentName, props, []);
      // const componentNode = new ComponentNode(componentName, props, children);
      components.push(componentNode);
    }
  }
  return components;
}

function getPropValue(node: Node) {
  if (Object.keys(node).includes('expression')) {
    return node.expression.value; // look into the value (node) and find the expression
  } else {
    return node.value; // return the value
  }
}

function getProps(node: Node){
  const propObj = {};
  for(let prop of node.openingElement.attributes){
    const name = prop.name.name;
    propObj[name] = getPropValue(prop.value);
    // console.log('propObj', propObj);
  }
  // console.log(propArr);
  return propObj;
}

export default function main(filePath: string) {
  // console.log(filePath);
  const tree = getTree(filePath);
  const importNodes = getImportNodes(tree);
  const variableNodes = getVariableNodes(tree);
  const childrenNodes = getChildrenNodes(variableNodes);
  const jsxNodes = getJsxNodes(childrenNodes);
  const result = getChildrenComponents(jsxNodes, importNodes);
  // console.log(result);
  return result;
}

main('./App.jsx');
// main('./newApp.jsx');

*/ 
