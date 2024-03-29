import React from 'react';

import Drawer from 'components/Drawer/Drawer';
import MapLegend from 'components/MapLegend/MapLegend';
import { mapLegend, LegendComponent, mapTitleLegend } from 'components/FormMap/FormMap.config';
import TerraDrawMapFilters from 'components/TerraDrawMap/TerraDrawMapFilters';

class MapDrawer extends React.Component {
  state = {
    expanded: this.props.expandOnInit === undefined
      ? true
      : this.props.expandOnInit,
  };

  toggleDrawer = () =>
    this.setState({ expanded: !this.state.expanded });

  render () {
    const {
      sources,
      filters,
      setLayerVisibility,
      getLayoutProperty,
    } = this.props;

    return (
      <Drawer
        id="map-drawer"
        visible={this.state.expanded}
        handleVisibilityToggle={this.toggleDrawer}
      >
        <MapLegend
          title={mapTitleLegend.titleLegend}
          legend={mapLegend}
          Component={LegendComponent}
        />
        {sources.map(source => (
          <TerraDrawMapFilters
            key={source.id}
            source={source}
            getLayoutProperty={getLayoutProperty}
            setLayerVisibility={setLayerVisibility}
            filters={filters}
          />
        ))}
      </Drawer>
    );
  }
}

export default MapDrawer;
