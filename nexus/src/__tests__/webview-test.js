import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import Leaf from '../webview/Leaf';
import NavLeaf from '../webview/NavLeaf';
import NodeWithChildren from '../webview/NodeWithChildren';
import Prop from '../webview/Prop';
import SidebarContainer from '../webview/SidebarContainer';
 
describe('Unit testing React components', () => {
  describe('Leaf', () => {
    const props = {
      name: 'Prop Name',
      price: '500',
      label: 'Label'
    };

    test('test', () => {
      expect(5).toEqual(5);
    });

  });

});