const fs = require('fs');
const path = require('path');
// import { Parser } from '../../out/parser/parserv2.js';
import { NextParser } from '../parser/NextParser.js';

describe('NextJS Parser Unit Tests', () => {
  let parser;
  let importNodes;
  let variableNodes;
  let nonImportNodes;
  let childrenNodes;
  let jsxNodes; 
  let exportDefaultNodes;

  //TODO: implement inner describe blocks to test different example files

  beforeAll(() => {
    parser = new NextParser(fs.readFileSync(path.resolve(__dirname, './test_components/jams-n-jams-app/pages/index.js')));
    importNodes = parser.getImportNodes(parser.programBody);
    variableNodes = parser.getVariableNodes(parser.programBody);
    nonImportNodes = parser.getNonImportNodes(parser.programBody);
    exportDefaultNodes = parser.getExportDefaultNodes(parser.programBody);
    
  });

  it('parser program body should be of type array', () => {
    expect(typeof parser.programBody).toEqual('object');
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

});
