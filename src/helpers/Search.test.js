import React from 'react';
import renderer from 'react-test-renderer';
import { Search } from 'components/Userrequest/Search';
import enzymeSetup from './EnzymeSetup';

const props = {
  handleQueryUpdate: jest.fn(),
  location: { search: 'Hadooooken' },
};

const { enzymeWrapper } = enzymeSetup(props, Search);

describe('components', () => {
  describe('Search', () => {
    it('should render', () => {
      const tree = renderer
        .create(<Search handleQueryUpdate={jest.fn()} location={{ search: '' }} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should have default values', () => {
      const searchProps = enzymeWrapper.find('Search').props();
      const {
        addonBefore,
        placeholder,
        enterButton,
      } = searchProps;

      expect(addonBefore).toEqual('');
      expect(placeholder).toEqual("Numéro de déclaration, titre de l'événement…");
      expect(enterButton).toBe(true);
    });

    it('should search wording', () => {
      const searchProps = enzymeWrapper.find('Search').props();
      const { onSearch } = searchProps;

      onSearch('Hadoken');
      expect(props.handleQueryUpdate.mock.calls).toEqual([[{ search: 'Hadoken' }, true]]);
    });
  });
});
