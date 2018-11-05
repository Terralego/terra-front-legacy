import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import NewUserrequestButton from 'components/Userrequest/NewUserrequestButton';

Enzyme.configure({ adapter: new Adapter() });

function setup () {
  const props = {
    type: 'primary',
    className: '',
    style: {},
  };

  const enzymeWrapper = shallow(<NewUserrequestButton {...props} />);

  return {
    props,
    enzymeWrapper,
  };
}


describe('components', () => {
  describe('UserrequestButton', () => {
    it('should link to new-request', () => {
      const { enzymeWrapper } = setup();
      const linkProps = enzymeWrapper.find('Link').props();
      expect(linkProps.to).toBe('/new-request');
    });

    it('should had content', () => {
      const { enzymeWrapper } = setup();
      const Button = enzymeWrapper.find('Button');
      const buttonProps = Button.props();

      expect(buttonProps.icon).toBe('file-add');
      expect(buttonProps.type).toBe('primary');
      expect(Button.children().text()).toBe('Déclarer une activité');
    });
  });
});
