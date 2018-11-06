import NewUserrequestButton from 'components/Userrequest/NewUserrequestButton';
import enzymeSetup from './EnzymeSetup';

const props = {
  type: 'primary',
  className: '',
  style: {},
};

const { enzymeWrapper } = enzymeSetup(props, NewUserrequestButton);

describe('components', () => {
  describe('UserrequestButton', () => {
    it('should link to new-request', () => {
      const linkProps = enzymeWrapper.find('Link').props();
      expect(linkProps.to).toBe('/new-request');
    });

    it('should had content', () => {
      const Button = enzymeWrapper.find('Button');
      const buttonProps = Button.props();

      expect(buttonProps.icon).toBe('file-add');
      expect(buttonProps.type).toBe('primary');
      expect(Button.children().text()).toBe('Déclarer une activité');
    });
  });
});
