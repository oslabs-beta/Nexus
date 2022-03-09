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
    constructor(sourceCode, str) {
        this.string = str;
        console.log('Source Code: ', sourceCode);
        console.log('dirname: ', __dirname);
        this.program = JSXPARSER.parse(sourceCode, { sourceType: "module", ecmaVersion: 6 }); // Node Object -> take body property (Array)
        console.log('program: ', this.program);
        this.programBody = this.program.body;
        console.log('program body: ', this.programBody);
    }
    //methods
    getImportNodes(programBody) {
        const importNodes = programBody.filter((node) => node.type === 'ImportDeclaration');
        // console.log(importNodes);
        return importNodes;
    }
    getVariableNodes(programBody) {
        console.log('heres the programBody: ', programBody);
        const variableNodes = programBody.filter((node) => node.type === 'ExportDefaultDeclaration');
        console.log(variableNodes);
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
        console.log('testing... ', variableNodes);
        // RETURN STATEMENT in functional component
        // TODO: refactor to look at all nodes, not just last varDeclaration node
        const nodes = variableNodes[variableNodes.length - 1].declaration.body.body;
        console.log('nodes: ', nodes);
        const returnNode = nodes.filter((node) => node.type === 'ReturnStatement')[0];
        const childrenNodes = returnNode.argument.children;
        console.log(childrenNodes);
        return childrenNodes;
    }
    getJsxNodes(childrenNodes) {
        const jsxNodes = childrenNodes.filter((node) => node.type === JSXELEMENT);
        return jsxNodes;
    }
    getChildrenComponents(jsxNodes, importNodes) {
        console.log('more testing... ', jsxNodes, importNodes);
        const components = [];
        const regex = '../components/';
        const importValues = importNodes.map((node) => node.source.value);
        // const componentPaths = importValues.filter((str) => str.slice(0, 14) === regex); 
        console.log('tesing Regex: ', importValues);
        const cache = {};
        for (let str of importValues) {
            const splitName = str.split('/');
            const componentPath = splitName[splitName.length - 1];
            const name = componentPath.split('.')[0];
            cache[name] = str;
        }
        console.log('Cache', cache);
        // match cache key with last part of cache string value
        // hard code excluding next
        // two conditions: doesn't begin with 'next',
        // key matches last part of string
        //Milk: '../comps/Milk/Milk
        //Head: 'next/head'
        //Nav: '../components/Nav/Nav'
        //Jumbotron: '../components/Nav/Jumbotron/Jumbotron'
        //styles: '../styles/Home.module.css'
        // importValues = ['./Children.jsx', 'react', 'react-router-dom']
        for (let node of jsxNodes) {
            const firstChar = node.openingElement.name.name[0]; // actual name label (i.e. 'Chatroom', 'Component')
            const componentName = node.openingElement.name.name;
            console.log('MOAR TESTING: ', firstChar, componentName);
            if (firstChar === firstChar.toUpperCase()) {
                const props = this.getProps(node);
                console.log('props: ', props);
                // check componentName against importNodes
                // if name matches import node name, take filepath
                // recursively invoke parsing algo on file
                let children = [];
                let dataFetching = 'ssg';
                let stringFP;
                if (cache[`${componentName}`]) {
                    children = this.recurse(cache[`${componentName}`]);
                    console.log('DEBUG getChildrenComponents: ', children);
                    stringFP = this.string.split('/pages')[0] + cache[`${componentName}`].slice(2);
                    console.log(stringFP);
                    const tree = this.getTree(stringFP + '.js');
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
        console.log('THE TEST STR: ', this.string); // -> /home/nicoflo/cats-app/pages/index.js
        console.log('filepath in recurse: ', filePath);
        console.log('path.resolve in recurse: ', path.resolve(filePath));
        console.log('anotha test: ', this.string.split('/pages'));
        let str = this.string.split('/pages')[0] + filePath.slice(2);
        // console.log('modified string: ', str); // -> /home/nicoflo/cats-app/pages/index.js
        function getTree(filePath) {
            filePath += '.js';
            console.log('here!!!: ', filePath);
            const source = fs.readFileSync(path.resolve(__dirname, filePath));
            const parsed = JSXPARSER.parse(source, { sourceType: "module" });
            const programBody = parsed.body; // get body of Program Node(i.e. source code entry)
            return programBody;
        }
        const tree = getTree(str);
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
        console.log('variableNodes: ', variableNodes);
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
        console.log('what is this? ', this.funcOrClass(this.programBody));
        let variableNodes;
        // if (this.funcOrClass(this.programBody) === 'JSXElement') {
        variableNodes = this.getVariableNodes(this.programBody);
        console.log('varNodes: ', variableNodes);
        const childrenNodes = this.getChildrenNodes(variableNodes);
        const jsxNodes = this.getJsxNodes(childrenNodes);
        const result = this.getChildrenComponents(jsxNodes, importNodes);
        console.log(result);
        for (let i = 0; i < result.length; i++) {
            if (result[i].children === undefined) {
                result[i].children = [];
            }
        }
        return result;
        // } else {
        //   return this.getClassNodes(this.programBody);
        // }
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map