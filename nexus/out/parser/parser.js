"use strict";
// const PARSER = require('acorn').Parser;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const parserModule = require("acorn");
const PARSER = parserModule.Parser;
// const jsx = require('acorn-jsx');
const jsx = require("acorn-jsx");
const JSXPARSER = PARSER.extend(jsx());
const fs = require("fs");
const path = require("path");
// const fs = require("fs");
// const path = require("path");
// CONSTANTS 
const JSXTEXT = 'JSXText';
const JSXELEMENT = 'JSXElement';
const JSXEXPRESSIONCONTAINER = 'JSXExpressionContainer';
class ComponentNode {
    constructor(name, props, children, dataFetching) {
        this.name = name;
        this.children = children;
        this.props = props;
        this.dataFetching = dataFetching;
    }
}
class Parser {
    constructor(sourceCode) {
        console.log('Source Code: ', sourceCode);
        console.log('dirname: ', __dirname);
        this.program = JSXPARSER.parse(sourceCode, { sourceType: "module" }); // Node Object -> take body property (Array)
        console.log('program: ', this.program);
        this.programBody = this.program.body;
        console.log('program body: ', this.programBody);
        // this.fs = fs;
        // console.log('FROM PARSER CLASS: ', fs);
        // this.testFs = JSXPARSER.parse(fs.readFileSync(path.resolve(__dirname, './Children.jsx')), {sourceType: "module"});
    }
    //methods
    getImportNodes(programBody) {
        const importNodes = programBody.filter((node) => node.type === 'ImportDeclaration');
        return importNodes;
    }
    getVariableNodes(programBody) {
        const variableNodes = programBody.filter((node) => node.type === 'VariableDeclaration');
        return variableNodes;
    }
    getNonImportNodes(programBody) {
        const nonImportNodes = programBody.filter((node) => node.type !== 'ImportDeclaration');
        return nonImportNodes;
    }
    getExportNamedNodes(programBody) {
        const exportNamedNodes = programBody.filter((node) => node.type === 'ExportNamedDeclaration');
        return exportNamedNodes;
    }
    getExportDefaultNodes(otherNodes) {
        const exportDefaultNode = otherNodes.filter((node) => {
            node.type === 'ExportDefaultDeclaration';
        })[0];
        return exportDefaultNode;
    }
    getChildrenNodes(variableNodes) {
        // RETURN STATEMENT in functional component
        // TODO: refactor to look at all nodes, not just last varDeclaration node
        const nodes = variableNodes[variableNodes.length - 1].declarations[0].init.body.body;
        const returnNode = nodes.filter((node) => node.type === 'ReturnStatement')[0];
        const childrenNodes = returnNode.argument.children;
        return childrenNodes;
    }
    getJsxNodes(childrenNodes) {
        const jsxNodes = childrenNodes.filter((node) => node.type === JSXELEMENT);
        return jsxNodes;
    }
    getChildrenComponents(jsxNodes, importNodes) {
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
                const props = this.getProps(node);
                // check componentName against importNodes
                // if name matches import node name, take filepath
                // recursively invoke parsing algo on file
                let children = [];
                let dataFetching = 'ssg';
                if (cache[`${componentName}`]) {
                    children = this.recurse(cache[`${componentName}`]);
                    console.log('DEBUG getChildrenComponents: ', children);
                    const tree = this.getTree(cache[`${componentName}`]);
                    dataFetching = this.detectFetchingMethod(tree); // -> FetchingMethod.ssr or FetchingMethod.ssg
                }
                // const componentNode = new ComponentNode(componentName, props, []);
                const componentNode = new ComponentNode(componentName, props, children, dataFetching);
                components.push(componentNode);
            }
        }
        return components;
    }
    getPropValue(node) {
        if (Object.keys(node).includes('expression')) {
            return node.expression.value; // look into the value (node) and find the expression 
        }
        else {
            return node.value; // return the value 
        }
    }
    getProps(node) {
        const propObj = {};
        for (let prop of node.openingElement.attributes) {
            const name = prop.name.name;
            propObj[name] = this.getPropValue(prop.value);
            // console.log('propObj', propObj);
        }
        // console.log(propArr);
        return propObj;
    }
    detectFetchingMethod(tree) {
        // filter all ExportNamedDeclaration types
        // loop through all to find one with declation.id.name === 'getServerSideProps' 
        // can refactor to getStaticProps
        const exportNamedNodes = this.getExportNamedNodes(tree);
        console.log('exported named nodes: ', exportNamedNodes);
        let dataMethod = '';
        // if no exportNamedNodes, infer that it's ssg bc of next.js default
        if (exportNamedNodes.length === 0) {
            dataMethod = 'ssg';
            return dataMethod;
        }
        for (const node of exportNamedNodes) {
            console.log('looping');
            if (exportNamedNodes.every((node) => node.declaration.id.name !== 'getServerSideProps')) {
                console.log('should be ssg');
                dataMethod = 'ssg';
            }
            if (node.declaration.id.name === 'getServerSideProps') {
                console.log('should be ssg');
                dataMethod = 'ssr';
                break;
            }
        }
        return dataMethod;
    }
    getTree(filePath) {
        const source = fs.readFileSync(path.resolve(__dirname, filePath));
        const parsed = JSXPARSER.parse(source, { sourceType: "module" });
        const programBody = parsed.body; // get body of Program Node(i.e. source code entry)
        return programBody;
    }
    recurse(filePath) {
        console.log('filepath in recurse: ', filePath);
        console.log('path.resolve in recurse: ', path.resolve(__dirname, filePath));
        function getTree(filePath) {
            const source = fs.readFileSync(path.resolve(__dirname, filePath));
            const parsed = JSXPARSER.parse(source, { sourceType: "module" });
            const programBody = parsed.body; // get body of Program Node(i.e. source code entry)
            return programBody;
        }
        const tree = getTree(filePath);
        console.log(`IN RECURSE WITH ${filePath}`);
        // console.log(tree);
        let variableNodes;
        if (this.funcOrClass(tree) === 'JSXElement') {
            console.log('RECURSE: JSXELEMENT');
            const importNodes = this.getImportNodes(tree);
            variableNodes = this.getVariableNodes(tree);
            const childrenNodes = this.getChildrenNodes(variableNodes);
            const jsxNodes = this.getJsxNodes(childrenNodes);
            const result = this.getChildrenComponents(jsxNodes, importNodes);
            return result;
        }
        else {
            console.log('RECURSE: CLASS');
            console.log(tree);
            return this.getClassNodes(tree);
        }
        // const variableNodes = this.getVariableNodes(tree);
        // const childrenNodes = this.getChildrenNodes(variableNodes);
        // const jsxNodes = this.getJsxNodes(childrenNodes);
        // const result = this.getChildrenComponents(jsxNodes, importNodes);
        // console.log(result);
        // return result;
    }
    funcOrClass(tree) {
        // using this.programBody, check if file contains functional or class component
        // look at all VariableDeclarations
        // if the type of the object in the body array is a varDeclatation &&
        // const variableNodes = this.getVariableNodes(this.programBody);
        const variableNodes = this.getVariableNodes(tree);
        // if functional, return "JSXELEMENT"
        try {
            const nodes = variableNodes[variableNodes.length - 1].declarations[0].init.body.body;
            const returnNode = nodes.filter((node) => node.type === 'ReturnStatement')[0];
            const nodeType = returnNode.argument.type;
            return nodeType;
        }
        catch (_a) {
            // if class object, return undefined
            return;
        }
    }
    getClassNodes(tree) {
        const resultObj = this.getVariableNodes(tree);
        let classObj = tree.filter(node => {
            return node.type === 'ClassDeclaration';
        });
        // [Node, Node]
        // console.log('second array of objects ', classObj);
        // console.log(classObj[1].body.body[1].value.body.body[0].argument.openingElement.name.name);//.body[1].value.body.body[0].argument.openingElement.name.name);**
        // // filter all class declarations (like above)
        // // for each class declaration node, look at body.body (Array)
        for (let i = 0; i < classObj.length; i++) {
            for (let j = 0; j < classObj[i].body.body.length; j++) {
                // console.log(classObj[i].body.body[j]);
                if (classObj[i].body.body[j].key.name === 'render') {
                    // console.log('it works!' , classObj[i].body.body[j].value.body.body[0].argument.openingElement.name.name);
                    // console.log('it works!' , classObj[i].body.body[j].value.body.body[0].argument.children);
                    const data = classObj[i].body.body[j].value.body.body[0].argument.children;
                    const jsx = this.getJsxNodes(data);
                    const importNodes = this.getImportNodes(tree);
                    const allNodes = this.getChildrenComponents(jsx, importNodes);
                    return allNodes;
                    // console.log(jsx);
                    // console.log('ALL NODES: ', allNodes);
                }
            }
        }
    }
    main() {
        // console.log(filePath);
        console.log('this is in main');
        const importNodes = this.getImportNodes(this.programBody);
        let variableNodes;
        if (this.funcOrClass(this.programBody) === 'JSXElement') {
            variableNodes = this.getVariableNodes(this.programBody);
            const childrenNodes = this.getChildrenNodes(variableNodes);
            const jsxNodes = this.getJsxNodes(childrenNodes);
            const result = this.getChildrenComponents(jsxNodes, importNodes);
            return result;
        }
        else {
            return this.getClassNodes(this.programBody);
        }
        // functional
        //   const childrenNodes = this.getChildrenNodes(variableNodes);
        //   const jsxNodes = this.getJsxNodes(childrenNodes);
        //   const result = this.getChildrenComponents(jsxNodes, importNodes);
        //  // console.log(result);
        //   return result;
        // return {name: "App", children: result};
    }
}
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
//# sourceMappingURL=parser.js.map