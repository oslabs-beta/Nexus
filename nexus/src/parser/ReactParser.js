"use strict";
exports.__esModule = true;
exports.ReactParser = void 0;
// const PARSER = require('acorn').Parser;
var parserModule = require("acorn");
var PARSER = parserModule.Parser;
// const jsx = require('acorn-jsx');
var jsx = require("acorn-jsx");
var JSXPARSER = PARSER.extend(jsx());
var fs = require("fs");
var path = require("path");
// const fs = require("fs");
// const path = require("path");
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
var ReactParser = /** @class */ (function () {
    function ReactParser(sourceCode) {
        this.program = JSXPARSER.parse(sourceCode, { sourceType: "module" }); // Node Object -> take body property (Array)
        this.programBody = this.program.body;
    }
    //methods
    ReactParser.prototype.getImportNodes = function (programBody) {
        var importNodes = programBody.filter(function (node) { return node.type === 'ImportDeclaration'; });
        return importNodes;
    };
    ReactParser.prototype.getVariableNodes = function (programBody) {
        var variableNodes = programBody.filter(function (node) { return node.type === 'VariableDeclaration'; });
        return variableNodes;
    };
    ReactParser.prototype.getNonImportNodes = function (programBody) {
        var nonImportNodes = programBody.filter(function (node) { return node.type !== 'ImportDeclaration'; });
        return nonImportNodes;
    };
    ReactParser.prototype.getExportNamedNodes = function (programBody) {
        var exportNamedNodes = programBody.filter(function (node) { return node.type === 'ExportNamedDeclaration'; });
        return exportNamedNodes;
    };
    ReactParser.prototype.getExportDefaultNodes = function (otherNodes) {
        var exportDefaultNode = otherNodes.filter(function (node) {
            node.type === 'ExportDefaultDeclaration';
        })[0];
        return exportDefaultNode;
    };
    ReactParser.prototype.getChildrenNodes = function (variableNodes) {
        // RETURN STATEMENT in functional component
        // TODO: refactor to look at all nodes, not just last varDeclaration node
        var nodes = variableNodes[variableNodes.length - 1].declarations[0].init.body.body;
        var returnNode = nodes.filter(function (node) { return node.type === 'ReturnStatement'; })[0];
        var childrenNodes = returnNode.argument.children;
        return childrenNodes;
    };
    ReactParser.prototype.getJsxNodes = function (childrenNodes) {
        var jsxNodes = childrenNodes.filter(function (node) { return node.type === JSXELEMENT; });
        return jsxNodes;
    };
    ReactParser.prototype.getChildrenComponents = function (jsxNodes, importNodes) {
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
                var dataFetching = 'ssg';
                if (cache["".concat(componentName)]) {
                    children = this.recurse(cache["".concat(componentName)]);
                    var tree = this.getTree(cache["".concat(componentName)]);
                    dataFetching = this.detectFetchingMethod(tree); // -> FetchingMethod.ssr or FetchingMethod.ssg
                }
                // const componentNode = new ComponentNode(componentName, props, []);
                var componentNode = new ComponentNode(componentName, props, children, dataFetching);
                components.push(componentNode);
            }
        }
        return components;
    };
    ReactParser.prototype.getPropValue = function (node) {
        if (Object.keys(node).includes('expression')) {
            return node.expression.value; // look into the value (node) and find the expression 
        }
        else {
            return node.value; // return the value 
        }
    };
    ReactParser.prototype.getProps = function (node) {
        var propObj = {};
        for (var _i = 0, _a = node.openingElement.attributes; _i < _a.length; _i++) {
            var prop = _a[_i];
            var name_2 = prop.name.name;
            propObj[name_2] = this.getPropValue(prop.value);
        }
        return propObj;
    };
    ReactParser.prototype.detectFetchingMethod = function (tree) {
        // filter all ExportNamedDeclaration types
        // loop through all to find one with declation.id.name === 'getServerSideProps' 
        // can refactor to getStaticProps
        var exportNamedNodes = this.getExportNamedNodes(tree);
        var dataMethod = '';
        // if no exportNamedNodes, infer that it's ssg bc of next.js default
        if (exportNamedNodes.length === 0) {
            dataMethod = 'ssg';
            return dataMethod;
        }
        for (var _i = 0, exportNamedNodes_1 = exportNamedNodes; _i < exportNamedNodes_1.length; _i++) {
            var node = exportNamedNodes_1[_i];
            if (exportNamedNodes.every(function (node) { return node.declaration.id.name !== 'getServerSideProps'; })) {
                dataMethod = 'ssg';
            }
            if (node.declaration.id.name === 'getServerSideProps') {
                dataMethod = 'ssr';
                break;
            }
        }
        return dataMethod;
    };
    ReactParser.prototype.getTree = function (filePath) {
        var source = fs.readFileSync(path.resolve(__dirname, filePath));
        var parsed = JSXPARSER.parse(source, { sourceType: "module" });
        var programBody = parsed.body; // get body of Program Node(i.e. source code entry)
        return programBody;
    };
    ReactParser.prototype.recurse = function (filePath) {
        // console.log('path.resolve in recurse: ', path.resolve(__dirname, filePath));
        function getTree(filePath) {
            var source = fs.readFileSync(path.resolve(__dirname, filePath));
            var parsed = JSXPARSER.parse(source, { sourceType: "module" });
            var programBody = parsed.body; // get body of Program Node(i.e. source code entry)
            return programBody;
        }
        var tree = getTree(filePath);
        var variableNodes;
        if (this.funcOrClass(tree) === 'JSXElement') {
            var importNodes = this.getImportNodes(tree);
            variableNodes = this.getVariableNodes(tree);
            var childrenNodes = this.getChildrenNodes(variableNodes);
            var jsxNodes = this.getJsxNodes(childrenNodes);
            var result = this.getChildrenComponents(jsxNodes, importNodes);
            return result;
        }
        else {
            return this.getClassNodes(tree);
        }
    };
    ReactParser.prototype.funcOrClass = function (tree) {
        // using this.programBody, check if file contains functional or class component
        // look at all VariableDeclarations
        var variableNodes = this.getVariableNodes(tree);
        // if functional, return "JSXELEMENT"
        try {
            var nodes = variableNodes[variableNodes.length - 1].declarations[0].init.body.body;
            var returnNode = nodes.filter(function (node) { return node.type === 'ReturnStatement'; })[0];
            var nodeType = returnNode.argument.type;
            return nodeType;
        }
        catch (_a) {
            // if class object, return undefined
            return;
        }
    };
    ReactParser.prototype.getClassNodes = function (tree) {
        var resultObj = this.getVariableNodes(tree);
        var classObj = tree.filter(function (node) {
            return node.type === 'ClassDeclaration';
        });
        // [Node, Node]
        // console.log(classObj[1].body.body[1].value.body.body[0].argument.openingElement.name.name);//.body[1].value.body.body[0].argument.openingElement.name.name);**
        // // filter all class declarations (like above)
        // // for each class declaration node, look at body.body (Array)
        for (var i = 0; i < classObj.length; i++) {
            for (var j = 0; j < classObj[i].body.body.length; j++) {
                if (classObj[i].body.body[j].key.name === 'render') {
                    var data = classObj[i].body.body[j].value.body.body[0].argument.children;
                    var jsx_1 = this.getJsxNodes(data);
                    var importNodes = this.getImportNodes(tree);
                    var allNodes = this.getChildrenComponents(jsx_1, importNodes);
                    return allNodes;
                }
            }
        }
    };
    ReactParser.prototype.main = function () {
        var importNodes = this.getImportNodes(this.programBody);
        var variableNodes;
        if (this.funcOrClass(this.programBody) === 'JSXElement') {
            variableNodes = this.getVariableNodes(this.programBody);
            var childrenNodes = this.getChildrenNodes(variableNodes);
            var jsxNodes = this.getJsxNodes(childrenNodes);
            var result = this.getChildrenComponents(jsxNodes, importNodes);
            return result;
        }
        else {
            return this.getClassNodes(this.programBody);
        }
    };
    return ReactParser;
}());
exports.ReactParser = ReactParser;
