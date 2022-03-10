"use strict";
exports.__esModule = true;
exports.NextParser = void 0;
// @ts-nocheck
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
var NextParser = /** @class */ (function () {
    function NextParser(sourceCode, str) {
        this.string = str;
        this.program = JSXPARSER.parse(sourceCode, { sourceType: "module", ecmaVersion: 6 }); // Node Object -> take body property (Array)
        this.programBody = this.program.body;
    }
    //methods
    NextParser.prototype.getImportNodes = function (programBody) {
        var importNodes = programBody.filter(function (node) { return node.type === 'ImportDeclaration'; });
        return importNodes;
    };
    NextParser.prototype.getVariableNodes = function (programBody) {
        var variableNodes = programBody.filter(function (node) { return node.type === 'VariableDeclaration'; });
        return variableNodes;
    };
    NextParser.prototype.getExportDefaultNodes = function (programBody) {
        var exportDefaultNodes = programBody.filter(function (node) { return node.type === 'ExportDefaultDeclaration'; });
        return exportDefaultNodes;
    };
    NextParser.prototype.getNonImportNodes = function (programBody) {
        var nonImportNodes = programBody.filter(function (node) { return node.type !== 'ImportDeclaration'; });
        return nonImportNodes;
    };
    NextParser.prototype.getExportNamedNodes = function (programBody) {
        var exportNamedNodes = programBody.filter(function (node) { return node.type === 'ExportNamedDeclaration'; });
        return exportNamedNodes;
    };
    NextParser.prototype.getJsxNodes = function (childrenNodes) {
        var jsxNodes = childrenNodes.filter(function (node) { return node.type === JSXELEMENT; });
        return jsxNodes;
    };
    NextParser.prototype.getChildrenNodes = function (exportDefaultNodes) {
        // RETURN STATEMENT in functional component
        // TODO: refactor to look at all nodes, not just last varDeclaration node
        var nodes = exportDefaultNodes[exportDefaultNodes.length - 1].declaration.body.body;
        var returnNode = nodes.filter(function (node) { return node.type === 'ReturnStatement'; })[0];
        var childrenNodes = returnNode.argument.children;
        return childrenNodes;
    };
    NextParser.prototype.mapComponentToFilepath = function (jsxNodes, importNodes) {
        var map = {};
        var importValues = importNodes.map(function (node) { return node.source.value; });
        // const componentPaths = importValues.filter((str) => str.slice(0, 14) === regex); 
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
    NextParser.prototype.getTree = function (filePath) {
        var source = fs.readFileSync(path.resolve(filePath));
        var parsed = JSXPARSER.parse(source, { sourceType: "module" });
        var programBody = parsed.body; // get body of Program Node(i.e. source code entry)
        return programBody;
    };
    NextParser.prototype.getRouterEndpoints = function (tree) {
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
        // then, for each jsxelement, look at JSXOpeningElement attributes property (array)
        for (var i = 0; i < nestedJsxElements.length; i++) {
            var nestedAttributes = nestedJsxElements[i].openingElement.attributes;
            // for each JSXAttribute, find JSXIdentifier with name === onClick
            for (var j = 0; j < nestedAttributes.length; j++) {
                if (nestedAttributes[j].value.expression !== undefined && nestedAttributes[j].value.expression.body !== undefined) {
                    if (nestedAttributes[j].value.expression.body.callee.object.name === "router") {
                        endpoints.push(nestedAttributes[j].value.expression.body.arguments[0].value);
                    }
                }
            }
        }
        return endpoints;
    };
    NextParser.prototype.getChildrenComponents = function (jsxNodes, importNodes, nestedPath) {
        var cache = this.mapComponentToFilepath(jsxNodes, importNodes);
        // console.log('cache: ', cache);
        var components = [];
        // TODO: handle cases where router variable is not named router 
        // boolean to determine if component is using getStaticProps, getServerSideProps
        // when getting props from export default  
        var cacheKeys = Object.keys(cache);
        for (var i = 0; i < cacheKeys.length; i++) {
            console.log('Looping over: ', cacheKeys[i]);
            var filePath = cache[cacheKeys[i]];
            if (filePath.slice(0, 4) !== 'next' && filePath.slice(filePath.length - cacheKeys[i].length) === cacheKeys[i]) {
                //TODO: instead of hardcoding react, maybe pass in fileToRecurse into getChildrenComponents to catch more ed
                if (filePath !== 'react') {
                    // -> /home/nicoflo/cats-app/pages/index.js
                    var str = this.string.split('/pages')[0] + filePath.slice(2);
                    // get all file paths, match name without extension (.ts, .js, .jsx)
                    var extensions = ['.ts', '.js', '.jsx', '.tsx'];
                    for (var j = 0; j < extensions.length; j++) {
                        var path_1 = str + extensions[j];
                        // Strip all occurrences of '../' from path 
                        var arr = path_1.split('/'); // ['..', '..', 'components', 'Cards' 'CardItem.js']
                        var newPath = arr.filter(function (str) { return str !== '..'; }).join('/');
                        if (fs.existsSync(newPath)) {
                            var tree = this.getTree(newPath);
                            // check if current component imports useRouter from next/router
                            var importNodes_1 = this.getImportNodes(tree);
                            var usesRouter = false;
                            for (var i_1 = 0; i_1 < importNodes_1.length; i_1++) {
                                if (importNodes_1[i_1].source.value === 'next/router') {
                                    usesRouter = true;
                                }
                            }
                            // Check if component is importing from 'next/router'
                            if (usesRouter) {
                                var endpoints = this.getRouterEndpoints(tree);
                                var endpointChildren = [];
                                var props = this.getPropParameters(newPath, 'static');
                                var component = new ComponentNode(cacheKeys[i], props, endpointChildren, 'ssg');
                                for (var k = 0; k < endpoints.length; k++) {
                                    var fileToRecurse = this.string.split('/pages')[0] + "/pages".concat(endpoints[k], "/index.js");
                                    var children = [this.recurse(fileToRecurse)];
                                    var componentNode = new ComponentNode(endpoints[k], {}, children, 'ssg');
                                    component.children.push(componentNode);
                                }
                                components.push(component);
                                usesRouter = false;
                                // TODO: get props
                            }
                            else { // if conditional usesRouter
                                // console.log('usesRouter is falsy:', cacheKeys[i]);
                                var componentNode = new ComponentNode(cacheKeys[i], {}, [], 'ssg');
                                components.push(componentNode);
                            }
                        } // end if fsExistsSync
                    } // end j loop 
                }
                else { // if react conditional
                    var tree = this.getTree(nestedPath);
                    var endpoints = this.getRouterEndpoints(tree); // 
                    // with endpoint, use this.string to find /pages/cats/index.js
                    // loop over endpoints 
                    if (endpoints.length) {
                        var styleEndpoints = [];
                        for (var i_2 = 0; i_2 < endpoints.length; i_2++) {
                            styleEndpoints.push(endpoints[i_2].slice(1));
                            styleEndpoints = styleEndpoints.map(function (el) {
                                el = el.substring(el.indexOf("/"));
                                return el;
                            });
                            var fileToRecurse = this.string.split('/pages')[0] + "/pages".concat(endpoints[i_2], "/index.js");
                            var children = [];
                            var props = {};
                            children.push(this.recurse(fileToRecurse));
                            var componentNode = new ComponentNode(styleEndpoints[i_2], this.getPropParameters(fileToRecurse, 'static'), children, 'ssg');
                            components.push(componentNode);
                        }
                    }
                }
            }
        } // end i loop
        return components;
    }; // end getChildrenComponents
    NextParser.prototype.getPropParameters = function (filePath, placeholder) {
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
    NextParser.prototype.recurse = function (filePath) {
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
    NextParser.prototype.main = function () {
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
    return NextParser;
}());
exports.NextParser = NextParser;
