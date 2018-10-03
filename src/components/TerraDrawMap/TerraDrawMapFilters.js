import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import TerraDrawMapFilter from 'components/TerraDrawMap/TerraDrawMapFilter';

import { updateConfigValue } from 'modules/appConfig';

class TerraDrawMapFilters extends React.Component {
  componentDidMount () {
    // TODO: need to fix re-rendering of route to avoid multiple calls
    this.syncFiltersWithSource();
  }

  syncFiltersWithSource () {
    this.props.source.layers.forEach(layer => {
      if (layer.layout.visibility === 'visible') {
        this.toggleFilter(layer.id);
      }
    });
  }

  isLayerVisible (layerId) {
    return this.props.filters.indexOf(layerId) !== -1;
  }

  toggleFilter (layerId) {
    const visibility = this.isLayerVisible(layerId);
    let mapFilters = [
      ...this.props.filters,
      layerId,
    ];
    if (visibility) {
      mapFilters = mapFilters.filter(filter => filter !== layerId);
    }
    this.props.setLayerVisibility(layerId, visibility ? 'none' : 'visible');
    this.props.updateConfigValue('mapFilters', mapFilters);
  }

  render () {
    const { source: { showFilter, layers } } = this.props;

    if (!showFilter) {
      return null;
    }

    return layers.map(({ id, ...layerProps }) => (
      <TerraDrawMapFilter
        {...layerProps}
        key={id}
        checked={this.isLayerVisible(id)}
        toggleFilter={() => this.toggleFilter(id)}
      />
    ));
  }
}

const mapStateToProps = state => ({
  filters: state.appConfig.mapFilters,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    updateConfigValue,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TerraDrawMapFilters);
