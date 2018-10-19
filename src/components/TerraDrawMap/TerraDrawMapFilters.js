import React from 'react';
import PropTypes from 'prop-types';

import TerraDrawMapFilter from 'components/TerraDrawMap/TerraDrawMapFilter';


class TerraDrawMapFilters extends React.Component {
  state = {
    ...this.props.source.layers.reduce((acc, curr) =>
      ({ ...acc, [curr.id]: curr.layout.visibility === 'visible' }), {}),
  };

  componentDidMount () {
    const { filters } = this.props;
    filters.forEach(filter => {
      this.toggleFilter(filter)();
    });
  }

  shouldComponentUpdate (nextProps) {
    const { setLayerVisibility, filters } = this.props;
    if (nextProps.filters !== filters) {
      nextProps.filters.forEach(filter => {
        setLayerVisibility(filter, 'visible');
        this.setState({ [filter]: true });
      });
    }

    return true;
  }

  toggleFilter = layerId => () => {
    const { setLayerVisibility, getLayoutProperty } = this.props;
    const isVisible = getLayoutProperty(layerId, 'visibility') === 'visible';
    this.setState({ [layerId]: !this.state[layerId] });
    return setLayerVisibility(layerId, (isVisible ? 'none' : 'visible'));
  }

  isVisible = layerId => {
    const { getLayoutProperty } = this.props;
    return getLayoutProperty(layerId, 'visibility') === 'visible';
  }

  render () {
    const { source: { layers } } = this.props;
    return layers.map(({ id, layout, ...layerProps }) => (
      <TerraDrawMapFilter
        {...layerProps}
        key={id}
        toggleFilter={this.toggleFilter(id)}
        checked={this.state[id]}
      />
    ));
  }
}

TerraDrawMapFilters.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.string),
};

TerraDrawMapFilters.defaultProps = {
  filters: [],
};

export default TerraDrawMapFilters;
