import React from 'react';
import renderer from 'react-test-renderer';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Search } from 'components/Userrequest/Search';

Enzyme.configure({ adapter: new Adapter() });

function setup () {
  const props = {
    handleQueryUpdate: jest.fn(),
    location: { search: 'Hadooooken' },
  };

  const enzymeWrapper = shallow(<Search {...props} />);

  return {
    props,
    enzymeWrapper,
  };
}

describe('components', () => {
  describe('Search', () => {
    it('should render', () => {
      const tree = renderer
        .create(<Search handleQueryUpdate={jest.fn()} location={{ search: '' }} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should have default values', () => {
      const { enzymeWrapper, props } = setup();
      const searchProps = enzymeWrapper.find('Search').props();
      const {
        addonBefore,
        placeholder,
        enterButton,
        onSearch,
      } = searchProps;

      expect(addonBefore).toEqual('');
      expect(placeholder).toEqual("Numéro de déclaration, titre de l'événement…");
      expect(enterButton).toBe(true);
      onSearch('Hadoken');
      expect(props.handleQueryUpdate.mock.calls).toEqual([[{ search: 'Hadoken' }, true]]);
    });
  });
});
