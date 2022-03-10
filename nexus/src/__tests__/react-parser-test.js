const fs = require('fs');
const path = require('path');
import { Parser } from '../parser/parser.js';

describe('parser unit tests for functional component', () => {
  let parser;
  let importNodes;
  let variableNodes;
  let nonImportNodes;
  let childrenNodes;
  let jsxNodes; 

  beforeAll(() => {
    parser = new Parser(fs.readFileSync(path.resolve(__dirname, './test_components/App.jsx')));
    importNodes = parser.getImportNodes(parser.programBody);
    variableNodes = parser.getVariableNodes(parser.programBody);
    nonImportNodes = parser.getNonImportNodes(parser.programBody);
    childrenNodes = parser.getChildrenNodes(variableNodes);
    jsxNodes = parser.getJsxNodes(childrenNodes);
  });

  it('getImportNodes: Test that each element has type ImportDeclaration', () => {
    importNodes.forEach((node) => {
      expect(node.type).toEqual('ImportDeclaration');
    });
  });

  it('getVariableNodes: Test that each element has type VariableDeclaration', () => {
    variableNodes.forEach((node) => {
      expect(node.type).toEqual('VariableDeclaration');
    });
  });

  it('getNonImportNodes: Test that each element is not of type ImportDeclaration', () => {
    nonImportNodes.forEach((node) => {
      expect(node.type).not.toEqual('ImportDeclaration');
    });
  });

  it('getJsxNodes: Test that each element is of type JSXElement', () => {
    jsxNodes.forEach((node) => {
      expect(node.type).toEqual('JSXElement');
    });
  });

  it('getChildrenNodes: Test that each element is a ComponentNode', () => {
    childrenNodes = parser.getChildrenComponents(jsxNodes, []);
    childrenNodes.forEach((node) => {
      // expect(node).toBeInstanceOf(ComponentNode);
      expect(node).toHaveProperty('name');
      expect(node).toHaveProperty('children');
      expect(node).toHaveProperty('props');
    });

  });

});

describe('parser integration tests', () => {
  
  describe('parsing through functional component with 10 Nodes total, 7 ComponentNodes', () => {
    let parser;

    beforeAll(() => {
      // test component properties: 14 ESTree nodes; results in 7 ComponentNodes
      parser = new Parser(fs.readFileSync(path.resolve(__dirname, './test_components/App.jsx')));
    });
    
    it('programBody should have length of 10', () => {
      expect(parser.programBody.length).toEqual(10);
    });

    it('array from main() should contain 7 ComponentNodes', () => {
      expect(parser.main().length).toEqual(7);
    });

    it('nodes in returned array should have properties name, children, props', ()=> {
      parser.main().forEach((node) => {
        expect(node).toHaveProperty('name');
        expect(node).toHaveProperty('children');
        expect(node).toHaveProperty('props');
      });
    });

  });
  
  
  xdescribe('parsing through class components with _ Nodes total, _ ComponentNodes', () => {
    let parser;
    beforeAll(() => {
      // test component properties: 14 ESTree nodes; results in 7 ComponentNodes
      parser = new Parser(fs.readFileSync(path.resolve(__dirname, './test_components/newApp.jsx')));
      console.log(parser.main());
    });
    
    it('programBody should have length of _', () => {
      expect(5).toEqual(5);
    });
    
    // it('nodes in returned array should have properties name, children, props', () => {
      
      // });
    });
  
  });