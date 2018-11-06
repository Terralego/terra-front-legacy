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

export default setup;
