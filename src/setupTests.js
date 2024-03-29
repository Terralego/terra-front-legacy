import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

function setup (props, Component) {
  const enzymeWrapper = shallow(<Component {...props} />);

  return {
    props,
    enzymeWrapper,
  };
}

class LocalStorageMock {
  constructor () {
    this.store = {};
  }

  clear () {
    this.store = {};
  }

  getItem (key) {
    return this.store[key] || null;
  }

  setItem (key, value) {
    this.store[key] = value.toString();
  }

  removeItem (key) {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorageMock();

global.URL.createObjectURL = jest.fn();

export default setup;
