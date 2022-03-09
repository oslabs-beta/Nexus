// const PARSER = require('acorn').Parser;

import * as parserModule from 'acorn';
const PARSER = parserModule.Parser;
// const jsx = require('acorn-jsx');
import * as jsx from 'acorn-jsx';
const JSXPARSER = PARSER.extend(jsx());
import * as fs from 'fs';
import * as path from 'path';
import { kill } from 'process';

// const fs = require("fs");
// const path = require("path");

// CONSTANTS 
const JSXTEXT: string = 'JSXText';
const JSXELEMENT: string = 'JSXElement';
const JSXEXPRESSIONCONTAINER: string = 'JSXExpressionContainer';

// TS Interface 
interface Node {
  type: string,
  start: number,
  end: number,
  value: any,
  raw: string,
  declarations: Array<Node>,
  declaration: Node,
  properties: Array<Node>,
  method: boolean,
  init: Node,
  body: Array<any>|Node,
  children: Array<Node>,
  argument: Node,
  openingElement: Node,
  name: Node|string,
  attributes: Array<Node>,
  props: Node,
  expression: Node,
  source: Node,
}

interface ComponentNode {
  name: string,
  children: Array<any>,
  props: Object,
  dataFetching: string, // 'SSG', 'SSR'
}

class ComponentNode {
  constructor(name: string, props: Object, children: Array<any>, dataFetching: string) {
    this.name = name;
    this.children = children;
    this.props = props;
    this.dataFetching = dataFetching;
  }
}

// Class Parser
// constructor(sourceCode: Buffer) 
// Methods: all below methods

export interface Parser {
  string: any,
  program: any,
  programBody: Array<Node>,
  fs: any,
  testFs: any,
}

export class Parser {
  constructor(sourceCode: any, str: any) {
    this.string = str;
    // console.log('Source Code: ', sourceCode);
    // console.log('dirname: ', __dirname);
    this.program = JSXPARSER.parse(sourceCode, {sourceType: "module"}); // Node Object -> take body property (Array)
    // console.log('program: ', this.program);
    this.programBody = this.program.body;
    // console.log('program body: ', this.programBody);
  }

   //methods
   getImportNodes(programBody: Array<Node>) {
    const importNodes: Array<Node> = programBody.filter((node: Node) => node.type === 'ImportDeclaration');
    // console.log(importNodes);
    return importNodes;
  }

   getVariableNodes(programBody: Array<Node>) {
    const variableNodes: Array<Node> = programBody.filter((node: Node) => node.type === 'VariableDeclaration');
    return variableNodes;
  }

  getExportDefaultNodes(programBody: Array<Node>) {
    const exportDefaultNodes: Array<Node> = programBody.filter((node: Node) => node.type === 'ExportDefaultDeclaration');
    return exportDefaultNodes;
  }
  
  getNonImportNodes(programBody: Array<any>) {
    const nonImportNodes: Array<Node> = programBody.filter((node: Node) => node.type !== 'ImportDeclaration');
    return nonImportNodes;
  }

  getExportNamedNodes(programBody: Array<Node>) {
    const exportNamedNodes: Array<Node> = programBody.filter((node: Node) => node.type === 'ExportNamedDeclaration');
    return exportNamedNodes; 
  }

  getJsxNodes(childrenNodes: Array<Node>) {
    const jsxNodes: Array<Node> = childrenNodes.filter((node: Node) => node.type === JSXELEMENT);
    return jsxNodes;
  }

  getChildrenNodes(exportDefaultNodes: Array<Node>) {
    // console.log('testing... ', variableNodes);
    // RETURN STATEMENT in functional component
    // TODO: refactor to look at all nodes, not just last varDeclaration node
    const nodes = exportDefaultNodes[exportDefaultNodes.length-1].declaration.body.body;
    const returnNode = nodes.filter((node) => node.type === 'ReturnStatement')[0];
    const childrenNodes = returnNode.argument.children;
    return childrenNodes;
  }

  mapComponentToFilepath(jsxNodes: Array<Node>, importNodes: Array<Node>) {
    const map = {};
    const importValues = importNodes.map((node) => node.source.value);
    // const componentPaths = importValues.filter((str) => str.slice(0, 14) === regex); 
    // console.log('tesing Regex: ', importValues);
    // const map = {};
    for (let str of importValues) {
      const splitName = str.split('/');
      const componentPath = splitName[splitName.length-1];
      const name = componentPath.split('.')[0];
      map[name] = str;
    }
    // console.log('Map: ', map);
    return map;
  }

  getTree(filePath: string){
    // console.log('filePath: ', filePath);
    // console.log('path.resolve:', path.resolve(__dirname, filePath));
    // console.log('original string passed in', this.string);
    const source = fs.readFileSync(path.resolve(filePath));
    const parsed = JSXPARSER.parse(source, {sourceType: "module"}); 
    const programBody: Array<Node> = parsed.body; // get body of Program Node(i.e. source code entry)
    return programBody;
  }

  // input: array of nodes
  // output: endpoints (array)
  getRouterEndpoints(tree: Array<Node>) {
    // console.log('entering getRouterEndpoint with: ', tree);
    // TODO: hardcoded for router variable, change to find label for useRouter() instead to match against
    const exportObject =  this.getExportDefaultNodes(tree)[0];
    // TODO: figure out an automated way to pick up the return statement within the array without resorting to last index
    const returnStatement = exportObject.declaration.body.body[exportObject.declaration.body.body.length-1];
    const jsxElements = this.getJsxNodes(returnStatement.argument.children); //JSXElement
    const endpoints = [];
    // console.log('returnStatement: ', returnStatement)
    // console.log('jsxElements: ', jsxElements)
    // TODO: change from hardcoded 0th index
    // iterate through jsxelements, find node with router.push() callExpression
      // for each jsxelement, look at children and filter jsxelements again
      const nestedJsxElements = this.getJsxNodes(jsxElements[0].children);
      // console.log('nestedJsxElements: ', nestedJsxElements);
        // then, for each jsxelement, look at JSXOpeningElement attributes property (array)
        for(let i = 0; i < nestedJsxElements.length; i++) {
          const innerNest = nestedJsxElements[i].openingElement.attributes;
          // console.log('attributes: ', innerNest);
          // for each JSXAttribute, find JSXIdentifier with name === onClick
          for (let j = 0; j < innerNest.length; j++) {
            // console.log('innernest[j]: ', innerNest[j]);
            // console.log('innernest[j]: ', innerNest[j].value);
            // if name === onClick, match with value that is JSXExpressionContainer.expression.body.callee 
            if (innerNest[j].value.expression !== undefined) {
              // console.log('passed undefined conditional');
              // console.log('HIT LINE 177 innernest');
              if (innerNest[j].value.expression.body !== undefined) {

                if (innerNest[j].value.expression.body.callee.object.name === "router") //"router"
                // innerNest[j].value.expression.body.callee.property.name //"push"
                {
                  console.log('~~~~ENDPOINT~~~~~', innerNest[j].value.expression.body.arguments[0].value); //"/cats"
                  endpoints.push(innerNest[j].value.expression.body.arguments[0].value); //"/cats"
                  // return innerNest[j].value.expression.body.arguments[0].value; //"/cats"
                }
              }
            }
          }
        }
        return endpoints;
          // two identifiers needed: one with name router, one with name push
          // find CallExpression.arguments.value (i.e. '/cats')
  }

  getChildrenComponents(jsxNodes: Array<Node>, importNodes: Array<Node>, nestedPath: string) {
    // console.log('more testing... ', jsxNodes, importNodes);
    const cache = this.mapComponentToFilepath(jsxNodes, importNodes);
    console.log('cache: ', JSON.stringify(cache));
    const components = [];
    // TODO: handle cases where router variable is not named router 
    
    // iterate through each key in cache
    // check if value starts with 'next'

    const cacheKeys = Object.keys(cache);
    // console.log('before for loop');
    for (let i = 0; i < cacheKeys.length; i++) {
      console.log('Looping over: V', cacheKeys[i]);
      // splash component is at cacheKey[2];
      // console.log('Cache: ', cache);
      const filePath = cache[cacheKeys[i]];
      // console.log(filePath.slice(0, 4) !== 'next' && filePath.slice(filePath.length - cacheKeys[i].length) === cacheKeys[i]);
      if (filePath.slice(0, 4) !== 'next' && filePath.slice(filePath.length - cacheKeys[i].length) === cacheKeys[i]) {
        //TODO: instead of hardcoding react, maybe pass in fileToRecurse into getChildrenComponents to catch more ed
        if (filePath !== 'react') {
        // console.log('inside double conditional if');
        // console.log('THE TEST STR: ', this.string);
        // -> /home/nicoflo/cats-app/pages/index.js
        let str = this.string.split('/pages')[0] + filePath.slice(2);
        // console.log(this.string);
        // console.log('string split: ', this.string.split('/pages')[0]);
        // console.log('filePath: ', filePath);
        // console.log('resultantStr: ', str);
        // /home/nicoflo/cats-app + /components/Nav/Jumbotron/Jumbotron
        // get all file paths, match name without extension (.ts, .js, .jsx)
        const extensions = ['.ts', '.js', '.jsx', '.tsx'];
        for (let j = 0; j < extensions.length; j++) {
          let path = str + extensions[j];
          console.log('in J loop: ', path);
          // TAKE PATH, strip all ../ 
          const arr = path.split('/'); // ['..', '..', 'components', 'Cards' 'CardItem.js']
          // const newPath = arr.reduce((acc, str) => {
            //   if (str !== '..') {
              //     return acc += `/${str}`;
              //   }
              // }, '');
          const newPath = arr.filter((str) => str !== '..').join('/');
          console.log('NEW PATH', newPath);

          // change 4 paths to newPaths
          if (fs.existsSync(newPath)) {
            console.log('in fsExistsSync: ', newPath);
            const tree = this.getTree(newPath);
            // console.log('*********TREE: ', tree);
            
            // check if current component imports useRouter from next/router
            const importNodes = this.getImportNodes(tree);
            let usesRouter = false;
            for (let i = 0; i < importNodes.length; i++) {
              if (importNodes[i].source.value === 'next/router') {
                usesRouter = true;
              }
            }
            
            console.log(`in j loop BEFORE ROUTER CHECK: ${cacheKeys[i]}`, newPath);
            console.log('usesRouter:', usesRouter);
            if (usesRouter) {
              // if conditional to check router vs nonrouter using tree's import nodes
              const endpoints = this.getRouterEndpoints(tree); // '/cats'      console.log('endpoint: ', endpoint);
              // with endpoint, use this.string to find /pages/cats/index.js
              // console.log('after endpoints: ', endpoints);
              // loop over endpoints 
              const endpointChildren = [];
              const component = new ComponentNode(cacheKeys[i], {}, endpointChildren, 'ssg');
              for (let k = 0; k < endpoints.length; k++) {
                console.log('in k loop at 250');
                let fileToRecurse = this.string.split('/pages')[0] + `/pages${endpoints[k]}/index.js`;
                // console.log(this.getTree(fileToRecurse));
                // console.log('fileToRecurse: ', fileToRecurse);
                const children = [this.recurse(fileToRecurse)];
                                                        // cacheKey[0] -> Home
                                                        // cacheKey[1] -> Nav
                                                        // splash component is at cacheKey[2];
                const componentNode = new ComponentNode(endpoints[k], {}, children, 'ssg');
                component.children.push(componentNode);
              }
              components.push(component);
              usesRouter = false;
              // TODO: get props
              // recurse over new cats/index.js
              // store as newChildren
              // make new ComponentNode to store information for frontend
              // cacheKeys[i] for name 
              // e.g. {name: 'Jumbotron', props: {}, children: newChildren }
              // newChildren: [{name: '/cats', props: {}, children: [ComponentNode(Nav), ComponentNode(Card)]}]
              } else { // if conditional usesRouter
                console.log('usesRouter is falsy: line 255 else statement:-- ', cacheKeys[i]);
                const componentNode = new ComponentNode(cacheKeys[i], {}, [], 'ssg');
                components.push(componentNode);              
              }
            } // end if fsExistsSync
          } // end j loop 
        } else { // if react conditional
          const tree = this.getTree(nestedPath);
          // console.log('parsing the super nested endpoints in pages/jams/index: ', tree);
          const endpoints = this.getRouterEndpoints(tree); // '/cats'      console.log('endpoint: ', endpoint);
          // with endpoint, use this.string to find /pages/cats/index.js
          // console.log('after endpoints: ', endpoints);
          // loop over endpoints 
          // console.log('super nested endpoints: ', endpoints);
          if (endpoints.length) {
            for (let i = 0; i < endpoints.length; i++) {
              console.log('in other loop at 287');
              let fileToRecurse = this.string.split('/pages')[0] + `/pages${endpoints[i]}/index.js`;
              // console.log(this.getTree(fileToRecurse));
              // console.log('fileToRecurse: ', fileToRecurse);
              const children = [];
              children.push(this.recurse(fileToRecurse));
              const componentNode = new ComponentNode(endpoints[i], {}, children, 'ssg');
              components.push(componentNode);
            }
          } 
          // else {
          //   const componentNode = new ComponentNode(cacheKeys[i], {}, [], 'ssg');
          //   components.push(componentNode);   
          // }
          console.log('~!@~!@FINAL COMPONENTS~!@~@', components);
        }
      }
    } // end i loop
    return components;
  } // end getChildrenComponents

  // input: string
  // output: 
  recurse(filePath: string) {
    // console.log('IN RECURSE: ', filePath);
    const obj = this.getTree(filePath);
    
    const importNodes = this.getImportNodes(obj);
    // TODO: consider other file structures
    const exportDefaultNodes = this.getExportDefaultNodes(obj);
    const childrenNodes = this.getChildrenNodes(exportDefaultNodes);
    const jsxNodes = this.getJsxNodes(childrenNodes); //Head, Nav, Jumbotron
    // console.log('IN RECURSE JSXNodes: ', jsxNodes);
    // console.log('from recurse: ', filePath);
    const result = this.getChildrenComponents(jsxNodes, importNodes, filePath);
    // console.log('IN RECURSE result: ', result);
    return result;
  }
    // Nav (/components)
    //  -> Link (href = "/cats")
    //    -> /
    //    -> /cats (/pages/cats/index.js)
    //    -> Nav, Card (/components)
    // Jumbotron (/components/Jumbotron)
    //  -> /
    //  -> /cats (/pages/cats/index.js)
    //    -> Nav, Card (/components)


  
  main () {
    const importNodes = this.getImportNodes(this.programBody);
    // TODO: consider other file structures
    let exportDefaultNodes;
    exportDefaultNodes = this.getExportDefaultNodes(this.programBody);
    const childrenNodes = this.getChildrenNodes(exportDefaultNodes);
    const jsxNodes = this.getJsxNodes(childrenNodes); //Head, Nav, Splash
    // console.log('JSXNodes: ', jsxNodes);
    const result = this.getChildrenComponents(jsxNodes, importNodes);
    console.log('****MAIN RESULT*****', result);
    // Splash
    //  /jams
    //    /jams/classics
    //    /jams/conserves
    //    /jams/marmalades
    //  /instruments ...
    //  /eventss ...
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