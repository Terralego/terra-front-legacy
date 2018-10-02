import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import { Switch } from 'antd';

import styles from 'components/TerraDrawMap/TerraDrawMapFilters.module.scss';
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
    const { source } = this.props;
    return source.showFilter && source.layers.map(({ id, icon, iconAlt, name, legendStyle }) => (
      <button
        type="button"
        className={classnames({
          [styles.filterItem]: true,
          [styles['filterItem--visible']]: this.isLayerVisible(id),
        })}
        key={`${id}_filter`}
        onClick={() => this.toggleFilter(id)}
      >
        <span className={styles.filterLabel}>
          {icon && <img src={icon} alt={iconAlt} className={styles.filterIcon} />}
          {legendStyle && <span style={legendStyle || {}} className={styles.filterStyle} />}
          {name}
        </span>

        <Switch
          defaultChecked={this.isLayerVisible(id)}
          checked={this.isLayerVisible(id)}
          size="small"
        />
      </button>
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
