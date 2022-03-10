"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextParser = void 0;
const parserModule = require("acorn");
const PARSER = parserModule.Parser;
const jsx = require("acorn-jsx");
const JSXPARSER = PARSER.extend(jsx());
const fs = require("fs");
const path = require("path");
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
class NextParser {
    constructor(sourceCode, str) {
        this.string = str;
        this.program = JSXPARSER.parse(sourceCode, { sourceType: "module", ecmaVersion: 6 }); // Node Object -> take body property (Array)
        this.programBody = this.program.body;
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
    getChildrenNodes(exportDefaultNodes) {
        // RETURN STATEMENT in functional component
        // TODO: refactor to look at all nodes, not just last varDeclaration node
        const nodes = exportDefaultNodes[exportDefaultNodes.length - 1].declaration.body.body;
        const returnNode = nodes.filter((node) => node.type === 'ReturnStatement')[0];
        const childrenNodes = returnNode.argument.children;
        return childrenNodes;
    }
    mapComponentToFilepath(jsxNodes, importNodes) {
        const map = {};
        const importValues = importNodes.map((node) => node.source.value);
        // const componentPaths = importValues.filter((str) => str.slice(0, 14) === regex); 
        // const map = {};
        for (let str of importValues) {
            const splitName = str.split('/');
            const componentPath = splitName[splitName.length - 1];
            const name = componentPath.split('.')[0];
            map[name] = str;
        }
        return map;
    }
    getTree(filePath) {
        const source = fs.readFileSync(path.resolve(filePath));
        const parsed = JSXPARSER.parse(source, { sourceType: "module" });
        const programBody = parsed.body; // get body of Program Node(i.e. source code entry)
        return programBody;
    }
    getRouterEndpoints(tree) {
        // console.log('entering getRouterEndpoint with: ', tree);
        // TODO: hardcoded for router variable, change to find label for useRouter() instead to match against
        const exportObject = this.getExportDefaultNodes(tree)[0];
        // TODO: figure out an automated way to pick up the return statement within the array without resorting to last index
        const returnStatement = exportObject.declaration.body.body[exportObject.declaration.body.body.length - 1];
        const jsxElements = this.getJsxNodes(returnStatement.argument.children); //JSXElement
        const endpoints = [];
        // TODO: change from hardcoded 0th index
        // for each jsxelement, look at children and filter jsxelements again
        // iterate through jsxelements, find node with router.push() callExpression
        const nestedJsxElements = this.getJsxNodes(jsxElements[0].children);
        // then, for each jsxelement, look at JSXOpeningElement attributes property (array)
        for (let i = 0; i < nestedJsxElements.length; i++) {
            const nestedAttributes = nestedJsxElements[i].openingElement.attributes;
            // for each JSXAttribute, find JSXIdentifier with name === onClick
            for (let j = 0; j < nestedAttributes.length; j++) {
                if (nestedAttributes[j].value.expression !== undefined && nestedAttributes[j].value.expression.body !== undefined) {
                    if (nestedAttributes[j].value.expression.body.callee.object.name === "router") {
                        endpoints.push(nestedAttributes[j].value.expression.body.arguments[0].value);
                    }
                }
            }
        }
        return endpoints;
    }
    getChildrenComponents(jsxNodes, importNodes, nestedPath) {
        const cache = this.mapComponentToFilepath(jsxNodes, importNodes);
        // console.log('cache: ', cache);
        const components = [];
        // TODO: handle cases where router variable is not named router 
        // boolean to determine if component is using getStaticProps, getServerSideProps
        // when getting props from export default  
        const cacheKeys = Object.keys(cache);
        for (let i = 0; i < cacheKeys.length; i++) {
            console.log('Looping over: ', cacheKeys[i]);
            const filePath = cache[cacheKeys[i]];
            if (filePath.slice(0, 4) !== 'next' && filePath.slice(filePath.length - cacheKeys[i].length) === cacheKeys[i]) {
                //TODO: instead of hardcoding react, maybe pass in fileToRecurse into getChildrenComponents to catch more ed
                if (filePath !== 'react') {
                    // -> /home/nicoflo/cats-app/pages/index.js
                    let str = this.string.split('/pages')[0] + filePath.slice(2);
                    // get all file paths, match name without extension (.ts, .js, .jsx)
                    const extensions = ['.ts', '.js', '.jsx', '.tsx'];
                    for (let j = 0; j < extensions.length; j++) {
                        let path = str + extensions[j];
                        // Strip all occurrences of '../' from path 
                        const arr = path.split('/'); // ['..', '..', 'components', 'Cards' 'CardItem.js']
                        const newPath = arr.filter((str) => str !== '..').join('/');
                        if (fs.existsSync(newPath)) {
                            const tree = this.getTree(newPath);
                            // check if current component imports useRouter from next/router
                            const importNodes = this.getImportNodes(tree);
                            let usesRouter = false;
                            for (let i = 0; i < importNodes.length; i++) {
                                if (importNodes[i].source.value === 'next/router') {
                                    usesRouter = true;
                                }
                            }
                            // Check if component is importing from 'next/router'
                            if (usesRouter) {
                                const endpoints = this.getRouterEndpoints(tree);
                                const endpointChildren = [];
                                const props = this.getPropParameters(newPath, 'static');
                                const component = new ComponentNode(cacheKeys[i], props, endpointChildren, 'ssg');
                                for (let k = 0; k < endpoints.length; k++) {
                                    let fileToRecurse = this.string.split('/pages')[0] + `/pages${endpoints[k]}/index.js`;
                                    const children = [this.recurse(fileToRecurse)];
                                    const componentNode = new ComponentNode(endpoints[k], {}, children, 'ssg');
                                    component.children.push(componentNode);
                                }
                                components.push(component);
                                usesRouter = false;
                                // TODO: get props
                            }
                            else { // if conditional usesRouter
                                // console.log('usesRouter is falsy:', cacheKeys[i]);
                                const componentNode = new ComponentNode(cacheKeys[i], {}, [], 'ssg');
                                components.push(componentNode);
                            }
                        } // end if fsExistsSync
                    } // end j loop 
                }
                else { // if react conditional
                    const tree = this.getTree(nestedPath);
                    const endpoints = this.getRouterEndpoints(tree); // 
                    // with endpoint, use this.string to find /pages/cats/index.js
                    // loop over endpoints 
                    if (endpoints.length) {
                        for (let i = 0; i < endpoints.length; i++) {
                            let fileToRecurse = this.string.split('/pages')[0] + `/pages${endpoints[i]}/index.js`;
                            const children = [];
                            const props = {};
                            children.push(this.recurse(fileToRecurse));
                            const componentNode = new ComponentNode(endpoints[i], this.getPropParameters(fileToRecurse, 'static'), children, 'ssg');
                            components.push(componentNode);
                        }
                    }
                }
            }
        } // end i loop
        return components;
    } // end getChildrenComponents
    getPropParameters(filePath, placeholder) {
        const obj = this.getTree(filePath);
        const importNodes = this.getImportNodes(obj);
        // TODO: consider other file structures
        const exportDefaultNodes = this.getExportDefaultNodes(obj);
        console.log('IN RECURSE: ', filePath);
        if (exportDefaultNodes[0].declaration.params.length) {
            const props = {};
            for (let i = 0; i < exportDefaultNodes[0].declaration.params[0].properties.length; i++) {
                props[exportDefaultNodes[0].declaration.params[0].properties[i].value.name] = placeholder;
            }
            return props;
        }
    }
    // input: string
    // output: 
    recurse(filePath) {
        const obj = this.getTree(filePath);
        const importNodes = this.getImportNodes(obj);
        // TODO: consider other file structures
        const exportDefaultNodes = this.getExportDefaultNodes(obj);
        // console.log('IN RECURSE: ', filePath);
        // if (exportDefaultNodes[0].declaration.params.length) {
        //   console.log('PARAM: ', exportDefaultNodes[0].declaration.params[0].properties[0].value.name);
        //   return exportDefaultNodes[0].declaration.params[0].properties[0].value.name;
        // }
        const childrenNodes = this.getChildrenNodes(exportDefaultNodes);
        const jsxNodes = this.getJsxNodes(childrenNodes); //Head, Nav, Jumbotron
        // console.log('IN RECURSE JSXNodes: ', jsxNodes);
        // console.log('from recurse: ', filePath);
        const result = this.getChildrenComponents(jsxNodes, importNodes, filePath);
        return result;
    }
    main() {
        const importNodes = this.getImportNodes(this.programBody);
        // TODO: consider other file structures
        let exportDefaultNodes;
        exportDefaultNodes = this.getExportDefaultNodes(this.programBody);
        const childrenNodes = this.getChildrenNodes(exportDefaultNodes);
        const jsxNodes = this.getJsxNodes(childrenNodes); //Head, Nav, Splash
        // console.log('JSXNodes: ', jsxNodes);
        const result = this.getChildrenComponents(jsxNodes, importNodes);
        console.log('****MAIN RESULT*****', result);
        return result;
        // Splash
        //  /jams
        //    /jams/classics
        //    /jams/conserves
        //    /jams/marmalades
        //  /instruments ...
        //  /events ...
        // Look at each element in array
        // check if there is an associated file with that component name
        // e.g. next/head vs ../components/jumbotron
    }
}
exports.NextParser = NextParser;
//# sourceMappingURL=NextParser.js.map