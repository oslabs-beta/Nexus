"use strict";
exports.__esModule = true;
exports.Parserv2 = void 0;
var parserModule = require("acorn");
var PARSER = parserModule.Parser;
var jsx = require("acorn-jsx");
var JSXPARSER = PARSER.extend(jsx());
var fs = require("fs");
var path = require("path");
// CONSTANTS 
var JSXTEXT = 'JSXText';
var JSXELEMENT = 'JSXElement';
var JSXEXPRESSIONCONTAINER = 'JSXExpressionContainer';
var ComponentNode = /** @class */ (function () {
    function ComponentNode(name, props, children, dataFetching) {
        this.name = name;
        this.children = children;
        this.props = props;
        this.dataFetching = dataFetching;
    }
    return ComponentNode;
}());
var Parserv2 = /** @class */ (function () {
    function Parserv2(sourceCode, str) {
        this.string = str;
        // console.log('Source Code: ', sourceCode);
        // console.log('dirname: ', __dirname);
        this.program = JSXPARSER.parse(sourceCode, { sourceType: "module", ecmaVersion: 6 }); // Node Object -> take body property (Array)
        // console.log('program: ', this.program);
        this.programBody = this.program.body;
        // console.log('program body: ', this.programBody);
    }
    //methods
    Parserv2.prototype.getImportNodes = function (programBody) {
        var importNodes = programBody.filter(function (node) { return node.type === 'ImportDeclaration'; });
        // console.log(importNodes);
        return importNodes;
    };
    Parserv2.prototype.getVariableNodes = function (programBody) {
        var variableNodes = programBody.filter(function (node) { return node.type === 'VariableDeclaration'; });
        return variableNodes;
    };
    Parserv2.prototype.getExportDefaultNodes = function (programBody) {
        var exportDefaultNodes = programBody.filter(function (node) { return node.type === 'ExportDefaultDeclaration'; });
        return exportDefaultNodes;
    };
    Parserv2.prototype.getNonImportNodes = function (programBody) {
        var nonImportNodes = programBody.filter(function (node) { return node.type !== 'ImportDeclaration'; });
        return nonImportNodes;
    };
    Parserv2.prototype.getExportNamedNodes = function (programBody) {
        var exportNamedNodes = programBody.filter(function (node) { return node.type === 'ExportNamedDeclaration'; });
        return exportNamedNodes;
    };
    Parserv2.prototype.getJsxNodes = function (childrenNodes) {
        var jsxNodes = childrenNodes.filter(function (node) { return node.type === JSXELEMENT; });
        return jsxNodes;
    };
    Parserv2.prototype.getChildrenNodes = function (exportDefaultNodes) {
        // console.log('testing... ', variableNodes);
        // RETURN STATEMENT in functional component
        // TODO: refactor to look at all nodes, not just last varDeclaration node
        var nodes = exportDefaultNodes[exportDefaultNodes.length - 1].declaration.body.body;
        var returnNode = nodes.filter(function (node) { return node.type === 'ReturnStatement'; })[0];
        var childrenNodes = returnNode.argument.children;
        return childrenNodes;
    };
    Parserv2.prototype.mapComponentToFilepath = function (jsxNodes, importNodes) {
        var map = {};
        var importValues = importNodes.map(function (node) { return node.source.value; });
        // const componentPaths = importValues.filter((str) => str.slice(0, 14) === regex); 
        // console.log('tesing Regex: ', importValues);
        // const map = {};
        for (var _i = 0, importValues_1 = importValues; _i < importValues_1.length; _i++) {
            var str = importValues_1[_i];
            var splitName = str.split('/');
            var componentPath = splitName[splitName.length - 1];
            var name_1 = componentPath.split('.')[0];
            map[name_1] = str;
        }
        return map;
    };
    Parserv2.prototype.getTree = function (filePath) {
        // console.log('filePath: ', filePath);
        // console.log('path.resolve:', path.resolve(__dirname, filePath));
        // console.log('original string passed in', this.string);
        var source = fs.readFileSync(path.resolve(filePath));
        var parsed = JSXPARSER.parse(source, { sourceType: "module" });
        var programBody = parsed.body; // get body of Program Node(i.e. source code entry)
        return programBody;
    };
    Parserv2.prototype.getRouterEndpoints = function (tree) {
        // console.log('entering getRouterEndpoint with: ', tree);
        // TODO: hardcoded for router variable, change to find label for useRouter() instead to match against
        var exportObject = this.getExportDefaultNodes(tree)[0];
        // TODO: figure out an automated way to pick up the return statement within the array without resorting to last index
        var returnStatement = exportObject.declaration.body.body[exportObject.declaration.body.body.length - 1];
        var jsxElements = this.getJsxNodes(returnStatement.argument.children); //JSXElement
        var endpoints = [];
        // TODO: change from hardcoded 0th index
        // for each jsxelement, look at children and filter jsxelements again
        // iterate through jsxelements, find node with router.push() callExpression
        var nestedJsxElements = this.getJsxNodes(jsxElements[0].children);
        // console.log('nestedJsxElements: ', nestedJsxElements);
        // then, for each jsxelement, look at JSXOpeningElement attributes property (array)
        for (var i = 0; i < nestedJsxElements.length; i++) {
            var nestedAttributes = nestedJsxElements[i].openingElement.attributes;
            // console.log('attributes: ', innerNest);
            // for each JSXAttribute, find JSXIdentifier with name === onClick
            for (var j = 0; j < nestedAttributes.length; j++) {
                // console.log('innernest[j]: ', innerNest[j]);
                if (nestedAttributes[j].value.expression !== undefined && nestedAttributes[j].value.expression.body !== undefined) {
                    // console.log('passed undefined conditional');
                    if (nestedAttributes[j].value.expression.body.callee.object.name === "router") {
                        console.log('~~~~ENDPOINT~~~~~', nestedAttributes[j].value.expression.body.arguments[0].value); //"/cats"
                        endpoints.push(nestedAttributes[j].value.expression.body.arguments[0].value);
                    }
                }
            }
        }
        return endpoints;
    };
    Parserv2.prototype.getChildrenComponents = function (jsxNodes, importNodes, nestedPath) {
        // console.log('more testing... ', jsxNodes, importNodes);
        var cache = this.mapComponentToFilepath(jsxNodes, importNodes);
        console.log('cache: ', cache);
        console.log(jsxNodes);
        var components = [];
        // TODO: handle cases where router variable is not named router 
        // boolean to determine if component is using getStaticProps, getServerSideProps
        // when getting props from export default  
        var cacheKeys = Object.keys(cache);
        // console.log('before for loop');
        for (var i = 0; i < cacheKeys.length; i++) {
            console.log('Looping over: ', cacheKeys[i]);
            // console.log('Cache: ', cache);
            var filePath = cache[cacheKeys[i]];
            if (filePath.slice(0, 4) !== 'next' && filePath.slice(filePath.length - cacheKeys[i].length) === cacheKeys[i]) {
                //TODO: instead of hardcoding react, maybe pass in fileToRecurse into getChildrenComponents to catch more ed
                if (filePath !== 'react') {
                    // -> /home/nicoflo/cats-app/pages/index.js
                    var str = this.string.split('/pages')[0] + filePath.slice(2);
                    // console.log('resultantStr: ', str);
                    // /home/nicoflo/cats-app + /components/Nav/Jumbotron/Jumbotron
                    // get all file paths, match name without extension (.ts, .js, .jsx)
                    var extensions = ['.ts', '.js', '.jsx', '.tsx'];
                    for (var j = 0; j < extensions.length; j++) {
                        var path_1 = str + extensions[j];
                        // Strip all occurrences of '../' from path 
                        var arr = path_1.split('/'); // ['..', '..', 'components', 'Cards' 'CardItem.js']
                        var newPath = arr.filter(function (str) { return str !== '..'; }).join('/');
                        if (fs.existsSync(newPath)) {
                            // console.log('in fsExistsSync: ', newPath);
                            var tree = this.getTree(newPath);
                            // check if current component imports useRouter from next/router
                            var importNodes_1 = this.getImportNodes(tree);
                            var usesRouter = false;
                            for (var i_1 = 0; i_1 < importNodes_1.length; i_1++) {
                                if (importNodes_1[i_1].source.value === 'next/router') {
                                    usesRouter = true;
                                }
                            }
                            // console.log(`in j loop BEFORE ROUTER CHECK: ${cacheKeys[i]}`, newPath);
                            // Check if component is importing from 'next/router'
                            if (usesRouter) {
                                var endpoints = this.getRouterEndpoints(tree);
                                // console.log('after endpoints: ', endpoints);
                                // loop over endpoints 
                                var endpointChildren = [];
                                var props = this.getPropParameters(newPath, 'static');
                                var component = new ComponentNode(cacheKeys[i], props, endpointChildren, 'ssg');
                                for (var k = 0; k < endpoints.length; k++) {
                                    // console.log('in k loop at 250');
                                    var fileToRecurse = this.string.split('/pages')[0] + "/pages".concat(endpoints[k], "/index.js");
                                    // console.log(this.getTree(fileToRecurse));
                                    // console.log('fileToRecurse: ', fileToRecurse);
                                    var children = [this.recurse(fileToRecurse)];
                                    var componentNode = new ComponentNode(endpoints[k], {}, children, 'ssg');
                                    component.children.push(componentNode);
                                }
                                components.push(component);
                                usesRouter = false;
                                // TODO: get props
                            }
                            else { // if conditional usesRouter
                                console.log('usesRouter is falsy: line 255 else statement:-- ', cacheKeys[i]);
                                var componentNode = new ComponentNode(cacheKeys[i], {}, [], 'ssg');
                                components.push(componentNode);
                            }
                        } // end if fsExistsSync
                    } // end j loop 
                }
                else { // if react conditional
                    var tree = this.getTree(nestedPath);
                    // console.log('parsing the super nested endpoints in pages/jams/index: ', tree);
                    var endpoints = this.getRouterEndpoints(tree); // '/cats'      console.log('endpoint: ', endpoint);
                    // with endpoint, use this.string to find /pages/cats/index.js
                    // console.log('after endpoints: ', endpoints);
                    // loop over endpoints 
                    // console.log('super nested endpoints: ', endpoints);
                    if (endpoints.length) {
                        for (var i_2 = 0; i_2 < endpoints.length; i_2++) {
                            console.log('in other loop at 255');
                            var fileToRecurse = this.string.split('/pages')[0] + "/pages".concat(endpoints[i_2], "/index.js");
                            // console.log(this.getTree(fileToRecurse));
                            // console.log('fileToRecurse: ', fileToRecurse);
                            var children = [];
                            var props = {};
                            children.push(this.recurse(fileToRecurse));
                            var componentNode = new ComponentNode(endpoints[i_2], this.getPropParameters(fileToRecurse, 'static'), children, 'ssg');
                            components.push(componentNode);
                        }
                    }
                    console.log('~!@~!@FINAL COMPONENTS~!@~@', components);
                }
            }
        } // end i loop
        return components;
    }; // end getChildrenComponents
    Parserv2.prototype.getPropParameters = function (filePath, placeholder) {
        var obj = this.getTree(filePath);
        var importNodes = this.getImportNodes(obj);
        // TODO: consider other file structures
        var exportDefaultNodes = this.getExportDefaultNodes(obj);
        console.log('IN RECURSE: ', filePath);
        if (exportDefaultNodes[0].declaration.params.length) {
            var props = {};
            for (var i = 0; i < exportDefaultNodes[0].declaration.params[0].properties.length; i++) {
                props[exportDefaultNodes[0].declaration.params[0].properties[i].value.name] = placeholder;
            }
            return props;
        }
    };
    // input: string
    // output: 
    Parserv2.prototype.recurse = function (filePath) {
        var obj = this.getTree(filePath);
        var importNodes = this.getImportNodes(obj);
        // TODO: consider other file structures
        var exportDefaultNodes = this.getExportDefaultNodes(obj);
        // console.log('IN RECURSE: ', filePath);
        // if (exportDefaultNodes[0].declaration.params.length) {
        //   console.log('PARAM: ', exportDefaultNodes[0].declaration.params[0].properties[0].value.name);
        //   return exportDefaultNodes[0].declaration.params[0].properties[0].value.name;
        // }
        var childrenNodes = this.getChildrenNodes(exportDefaultNodes);
        var jsxNodes = this.getJsxNodes(childrenNodes); //Head, Nav, Jumbotron
        // console.log('IN RECURSE JSXNodes: ', jsxNodes);
        // console.log('from recurse: ', filePath);
        var result = this.getChildrenComponents(jsxNodes, importNodes, filePath);
        return result;
    };
    Parserv2.prototype.main = function () {
        var importNodes = this.getImportNodes(this.programBody);
        // TODO: consider other file structures
        var exportDefaultNodes;
        exportDefaultNodes = this.getExportDefaultNodes(this.programBody);
        var childrenNodes = this.getChildrenNodes(exportDefaultNodes);
        var jsxNodes = this.getJsxNodes(childrenNodes); //Head, Nav, Splash
        // console.log('JSXNodes: ', jsxNodes);
        var result = this.getChildrenComponents(jsxNodes, importNodes);
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
    };
    return Parserv2;
}());
exports.Parserv2 = Parserv2;
