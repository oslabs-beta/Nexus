import * as parserModule from 'acorn';
const PARSER = parserModule.Parser;
import * as jsx from 'acorn-jsx';
const JSXPARSER = PARSER.extend(jsx());
import * as fs from 'fs';
import * as path from 'path';
​
// CONSTANTS 
const JSXTEXT: string = 'JSXText';
const JSXELEMENT: string = 'JSXElement';
const JSXEXPRESSIONCONTAINER: string = 'JSXExpressionContainer';
​
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
  id: string
}
​
interface ComponentNode {
  name: string,
  children: Array<any>,
  props: Object,
  dataFetching: string, // 'SSG', 'SSR'
}
​
class ComponentNode {
  constructor(name: string, props: Object, children: Array<any>, dataFetching: string) {
    this.name = name;
    this.children = children;
    this.props = props;
    this.dataFetching = dataFetching;
  }
}
​
// Class Parser
// constructor(sourceCode: Buffer) 
// Methods: all below methods
​
export interface Parser {
  string: any,
  program: any,
  programBody: Array<Node>,
  fs: any,
  testFs: any,
}
​
export class Parser {
  constructor(sourceCode: any, str: any) {
    this.string = str;
    // console.log('Source Code: ', sourceCode);
    // console.log('dirname: ', __dirname);
    this.program = JSXPARSER.parse(sourceCode, {sourceType: "module", ecmaVersion: 6}); // Node Object -> take body property (Array)
    // console.log('program: ', this.program);
    this.programBody = this.program.body;
    // console.log('program body: ', this.programBody);
  }
​
   //methods
   getImportNodes(programBody: Array<Node>) {
    const importNodes: Array<Node> = programBody.filter((node: Node) => node.type === 'ImportDeclaration');
    // console.log(importNodes);
    return importNodes;
  }
​
   getVariableNodes(programBody: Array<Node>) {
    const variableNodes: Array<Node> = programBody.filter((node: Node) => node.type === 'VariableDeclaration');
    return variableNodes;
  }
​
  getExportDefaultNodes(programBody: Array<Node>) {
    const exportDefaultNodes: Array<Node> = programBody.filter((node: Node) => node.type === 'ExportDefaultDeclaration');
    return exportDefaultNodes;
  }
  
  getNonImportNodes(programBody: Array<any>) {
    const nonImportNodes: Array<Node> = programBody.filter((node: Node) => node.type !== 'ImportDeclaration');
    return nonImportNodes;
  }
​
  getExportNamedNodes(programBody: Array<Node>) {
    const exportNamedNodes: Array<Node> = programBody.filter((node: Node) => node.type === 'ExportNamedDeclaration');
    return exportNamedNodes; 
  }
​
  getJsxNodes(childrenNodes: Array<Node>) {
    const jsxNodes: Array<Node> = childrenNodes.filter((node: Node) => node.type === JSXELEMENT);
    return jsxNodes;
  }
​
  getChildrenNodes(exportDefaultNodes: Array<Node>) {
    // console.log('testing... ', variableNodes);
    // RETURN STATEMENT in functional component
    // TODO: refactor to look at all nodes, not just last varDeclaration node
    const nodes = exportDefaultNodes[exportDefaultNodes.length-1].declaration.body.body;
    const returnNode = nodes.filter((node) => node.type === 'ReturnStatement')[0];
    const childrenNodes = returnNode.argument.children;
    return childrenNodes;
  }
​
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
    return map;
  }
​
  getTree(filePath: string){
    // console.log('filePath: ', filePath);
    // console.log('path.resolve:', path.resolve(__dirname, filePath));
    // console.log('original string passed in', this.string);
    const source = fs.readFileSync(path.resolve(filePath));
    const parsed = JSXPARSER.parse(source, {sourceType: "module"}); 
    const programBody: Array<Node> = parsed.body; // get body of Program Node(i.e. source code entry)
    return programBody;
  }
​
  getRouterEndpoints(tree: Array<Node>) {
    // console.log('entering getRouterEndpoint with: ', tree);
    // TODO: hardcoded for router variable, change to find label for useRouter() instead to match against
    const exportObject =  this.getExportDefaultNodes(tree)[0];
    // TODO: figure out an automated way to pick up the return statement within the array without resorting to last index
    const returnStatement = exportObject.declaration.body.body[exportObject.declaration.body.body.length-1];
    const jsxElements = this.getJsxNodes(returnStatement.argument.children); //JSXElement
    const endpoints = [];
    // TODO: change from hardcoded 0th index
    // for each jsxelement, look at children and filter jsxelements again
    // iterate through jsxelements, find node with router.push() callExpression
    const nestedJsxElements = this.getJsxNodes(jsxElements[0].children);
    // console.log('nestedJsxElements: ', nestedJsxElements);
    // then, for each jsxelement, look at JSXOpeningElement attributes property (array)
    for(let i = 0; i < nestedJsxElements.length; i++) {
      const nestedAttributes = nestedJsxElements[i].openingElement.attributes;
      // console.log('attributes: ', innerNest);
      // for each JSXAttribute, find JSXIdentifier with name === onClick
      for (let j = 0; j < nestedAttributes.length; j++) {
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
  }
​
  getChildrenComponents(jsxNodes: Array<Node>, importNodes: Array<Node>, nestedPath?: string) {
    // console.log('more testing... ', jsxNodes, importNodes);
    const cache = this.mapComponentToFilepath(jsxNodes, importNodes);
    console.log('cache: ', cache);
    console.log(jsxNodes);
    const components = [];
    // TODO: handle cases where router variable is not named router 
    // boolean to determine if component is using getStaticProps, getServerSideProps
    // when getting props from export default  
    
    const cacheKeys = Object.keys(cache);
    // console.log('before for loop');
    for (let i = 0; i < cacheKeys.length; i++) {
      console.log('Looping over: ', cacheKeys[i]);
      // console.log('Cache: ', cache);
      const filePath = cache[cacheKeys[i]];
      if (filePath.slice(0, 4) !== 'next' && filePath.slice(filePath.length - cacheKeys[i].length) === cacheKeys[i]) {
        //TODO: instead of hardcoding react, maybe pass in fileToRecurse into getChildrenComponents to catch more ed
        if (filePath !== 'react') {
​
        // -> /home/nicoflo/cats-app/pages/index.js
        let str = this.string.split('/pages')[0] + filePath.slice(2);
        // console.log('resultantStr: ', str);
        // /home/nicoflo/cats-app + /components/Nav/Jumbotron/Jumbotron
        // get all file paths, match name without extension (.ts, .js, .jsx)
        const extensions = ['.ts', '.js', '.jsx', '.tsx'];
        for (let j = 0; j < extensions.length; j++) {
          let path = str + extensions[j];
          // Strip all occurrences of '../' from path 
          const arr = path.split('/'); // ['..', '..', 'components', 'Cards' 'CardItem.js']
          const newPath = arr.filter((str) => str !== '..').join('/');
​
          if (fs.existsSync(newPath)) {
            // console.log('in fsExistsSync: ', newPath);
            const tree = this.getTree(newPath);
            
            // check if current component imports useRouter from next/router
            const importNodes = this.getImportNodes(tree);
            let usesRouter = false;
            for (let i = 0; i < importNodes.length; i++) {
              if (importNodes[i].source.value === 'next/router') {
                usesRouter = true;
              }
            }
            
            // console.log(`in j loop BEFORE ROUTER CHECK: ${cacheKeys[i]}`, newPath);
            // Check if component is importing from 'next/router'
            if (usesRouter) {
              const endpoints = this.getRouterEndpoints(tree); 
              // console.log('after endpoints: ', endpoints);
              // loop over endpoints 
              const endpointChildren = [];
              const props = this.getPropParameters(newPath, 'static');
              const component = new ComponentNode(cacheKeys[i], props, endpointChildren, 'ssg');
              for (let k = 0; k < endpoints.length; k++) {
                // console.log('in k loop at 250');
                let fileToRecurse = this.string.split('/pages')[0] + `/pages${endpoints[k]}/index.js`;
                // console.log(this.getTree(fileToRecurse));
                // console.log('fileToRecurse: ', fileToRecurse);
                const children = [this.recurse(fileToRecurse)];
                const componentNode = new ComponentNode(endpoints[k], {}, children, 'ssg');
                component.children.push(componentNode);
              }
              components.push(component);
              usesRouter = false;
              // TODO: get props
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
              console.log('in other loop at 255');
              let fileToRecurse = this.string.split('/pages')[0] + `/pages${endpoints[i]}/index.js`;
              // console.log(this.getTree(fileToRecurse));
              // console.log('fileToRecurse: ', fileToRecurse);
              const children = [];
              const props = {};
              children.push(this.recurse(fileToRecurse));
              const componentNode = new ComponentNode(endpoints[i], this.getPropParameters(fileToRecurse, 'static'), children, 'ssg');
              components.push(componentNode);
            }
          } 
          console.log('~!@~!@FINAL COMPONENTS~!@~@', components);
        }
      }
    } // end i loop
    return components;
  } // end getChildrenComponents



  getPropParameters(filePath: string, placeholder: string) {
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
  recurse(filePath: string) {
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
​
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