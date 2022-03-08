"use strict";
// const PARSER = require('acorn').Parser;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const parserModule = require("acorn");
const PARSER = parserModule.Parser;
// const jsx = require('acorn-jsx');
const jsx = require("acorn-jsx");
const JSXPARSER = PARSER.extend(jsx());
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
        // console.log('Source Code: ', sourceCode);
        // console.log('dirname: ', __dirname);
        this.program = JSXPARSER.parse(sourceCode, { sourceType: "module" }); // Node Object -> take body property (Array)
        // console.log('program: ', this.program);
        this.programBody = this.program.body;
        // console.log('program body: ', this.programBody);
    }
    //methods
    getImportNodes(programBody) {
        const importNodes = programBody.filter((node) => node.type === 'ImportDeclaration');
        // console.log(importNodes);
        return importNodes;
    }
    getVariableNodes(programBody) {
        const variableNodes = programBody.filter((node) => node.type === 'VariableDeclaration');
        return variableNodes;
    }
    getExportDefaultNodes(programBody) {
        const exportDefaultNodes = programBody.filter((node) => node.type === 'ExportDefaultDeclaration');
        return exportDefaultNodes;
    }
    getNonImportNodes(programBody) {
        const nonImportNodes = programBody.filter((node) => node.type !== 'ImportDeclaration');
        return nonImportNodes;
    }
    getExportNamedNodes(programBody) {
        const exportNamedNodes = programBody.filter((node) => node.type === 'ExportNamedDeclaration');
        return exportNamedNodes;
    }
    getJsxNodes(childrenNodes) {
        const jsxNodes = childrenNodes.filter((node) => node.type === JSXELEMENT);
        return jsxNodes;
    }
    getChildrenNodes(variableNodes) {
        console.log('testing... ', variableNodes);
        // RETURN STATEMENT in functional component
        // TODO: refactor to look at all nodes, not just last varDeclaration node
        const nodes = variableNodes[variableNodes.length - 1].declaration.body.body;
        //    console.log('nodes: ', nodes);
        const returnNode = nodes.filter((node) => node.type === 'ReturnStatement')[0];
        const childrenNodes = returnNode.argument.children;
        //    console.log(childrenNodes);
        return childrenNodes;
    }
    mapComponentToFilepath(jsxNodes, importNodes) {
        const map = {};
        const importValues = importNodes.map((node) => node.source.value);
        // const componentPaths = importValues.filter((str) => str.slice(0, 14) === regex); 
        // console.log('tesing Regex: ', importValues);
        // const map = {};
        for (let str of importValues) {
            const splitName = str.split('/');
            const componentPath = splitName[splitName.length - 1];
            const name = componentPath.split('.')[0];
            map[name] = str;
        }
        console.log('Map: ', map);
        return map;
    }
    getChildrenComponents(jsxNodes, importNodes) {
        // console.log('more testing... ', jsxNodes, importNodes);
        const cache = this.mapComponentToFilepath(jsxNodes, importNodes);
        // TODO: handle cases like this: 
        // import Jumbotron from '../components/Nav/Jumbotron/Jumbotron.js
        // iterate through each key in cache
        // check if value starts with 'next'
        Object.keys(cache).forEach(el => {
            if (cache[el].slice(0, 4) !== 'next') {
                // console.log('sliced version: ', cache[el].slice(cache[el].length - el.length));
                // console.log('element in obj: ', el);
                if (cache[el].slice(cache[el].length - el.length) === el) {
                    console.log('THE TEST STR: ', this.string);
                    // -> /home/nicoflo/cats-app/pages/index.js
                    let str = this.string.split('/pages')[0] + cache[el].slice(2);
                    console.log('resultantStr: ', str);
                    // /home/nicoflo/cats-app + /components/Nav/Jumbotron/Jumbotron
                    // construct filepath string
                    // pass into getTree
                }
            }
        });
        // if not, do stuff like below
        // key: jumbotron (9 chars)
        // slice of jumbotron value(jumbotron value length ~30 characters - 9)
        // we know that jumbotron has file associated with it.
    }
    main() {
        const importNodes = this.getImportNodes(this.programBody);
        // TODO: consider other file structures
        let exportDefaultNodes;
        exportDefaultNodes = this.getExportDefaultNodes(this.programBody);
        const childrenNodes = this.getChildrenNodes(exportDefaultNodes);
        const jsxNodes = this.getJsxNodes(childrenNodes); //Head, Nav, Jumbotron
        console.log('JSXNodes: ', jsxNodes);
        const result = this.getChildrenComponents(jsxNodes, importNodes);
        // Look at each element in array
        // check if there is an associated file with that component name
        // e.g. next/head vs ../components/jumbotron
        // LINK case: look at href tag
        // name: Link, children [Node(name: '/', children=[],props={})]
        // case '/': 
        // case '/{xyz}':
        // Nav (/components)
        //  -> Link (href = "/cats")
        //    -> /
        //    -> /cats (/pages/cats/index.js)
        //    -> Nav, Card (/components)
        // Jumbotron (/components/Jumbotron)
        //  -> /
        //  -> /cats (/pages/cats/index.js)
        //    -> Nav, Card (/components)
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parserv2.js.map