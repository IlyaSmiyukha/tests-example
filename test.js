import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import store from '@/store/store';

import RightPanel from '@/containers/RightPanel';

import {
  props,
} from './MockProps';

jest.mock('react-beautiful-dnd', () => ({
  Droppable: ({ children }) => children({
    draggableProps: {
      style: {},
    },
    innerRef: jest.fn(),
  }, {}),
  Draggable: ({ children }) => children({
    draggableProps: {
      style: {},
    },
    innerRef: jest.fn(),
  }, {}),
  DragDropContext: ({ children }) => children,
}));

describe('RightPanel component', () => {
  let component;

  beforeEach(() => {
    store.dispatch = jest.fn();
    component = render(<Provider store={store}>
      <RightPanel {...props}/>
    </Provider>);
  });

  it('should render component with state', async () => {
    const { getByText } = component;
    const name = await getByText(/my files/i);
    expect(name).toBeInTheDocument();
  });

  it('should change tabs to shared files', async () => {
    const { getByText } = component;
    //open dropdown
    const dropdown = await getByText(/my files/i);
    fireEvent.click(dropdown);

    //choose shared tab
    const shared = await getByText(/shared/i);
    fireEvent.click(shared);

    const newTab = await getByText(/shared/i);
    expect(newTab).toBeInTheDocument();
  });

  it('should change search input value', async () => {
    const { getByPlaceholderText } = component;
    //fill search input
    const search = await getByPlaceholderText(/type to/i);
    fireEvent.change(search, { target: { value: 'value' } });
    expect(search.value).toBe('value');
  });

  it('should search on enter click', async () => {
    const { getByPlaceholderText } = component;
    //fill search input
    const search = await getByPlaceholderText(/type to/i);
    fireEvent.change(search, { target: { value: 'value' } });
    expect(search.value).toBe('value');
    fireEvent.keyDown(search, { key: 'Enter', keyCode: 13 });
    expect(search.value).toBe('value');
  });

  it('should clear search on ESC click', async () => {
    const { getByPlaceholderText } = component;
    //fill search input
    const search = await getByPlaceholderText(/type to/i);
    fireEvent.change(search, { target: { value: 'value' } });
    expect(search.value).toBe('value');
    fireEvent.keyDown(search, { key: 'Esc', keyCode: 27 });
    expect(search.value).toBe('');
  });

  it('should clear search if input empty', async () => {
    const { getByPlaceholderText } = component;
    //fill search input
    const search = await getByPlaceholderText(/type to/i);
    fireEvent.change(search, { target: { value: 'value' } });
    expect(search.value).toBe('value');
    fireEvent.change(search, { target: { value: '' } });
    expect(search.value).toBe('');
  });

  it('should change tabs to shared files and clear search', async () => {
    const { getByText, getByPlaceholderText } = component;
    //fill search input
    const search = await getByPlaceholderText(/type to/i);
    fireEvent.change(search, { target: { value: 'new' } });
    expect(search.value).toBe('new');

    //open dropdown
    const dropdown = await getByText(/my files/i);
    fireEvent.click(dropdown);

    //choose shared tab
    const shared = await getByText(/shared/i);
    fireEvent.click(shared);

    const newTab = await getByText(/shared/i);
    expect(newTab).toBeInTheDocument();
    expect(search.value).toBe('');
  });

  it('should search shared files on enter click', async () => {
    const { getByText, getByPlaceholderText } = component;
    //open dropdown
    const dropdown = await getByText(/my files/i);
    fireEvent.click(dropdown);

    //choose shared tab
    const shared = await getByText(/shared/i);
    fireEvent.click(shared);

    //fill search input
    const search = await getByPlaceholderText(/type to/i);
    fireEvent.change(search, { target: { value: 'value' } });
    expect(search.value).toBe('value');
    fireEvent.keyDown(search, { key: 'Enter', keyCode: 13 });
    expect(search.value).toBe('value');
  });

});
