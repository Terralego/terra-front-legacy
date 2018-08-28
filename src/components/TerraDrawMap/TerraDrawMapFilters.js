import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Switch } from 'antd';

import styles from 'components/TerraDrawMap/TerraDrawMapFilters.module.scss';
import { updateConfigValue } from 'modules/appConfig';

const TerraDrawMapFilters = ({ source, toggleFilter, filters }) => {
  const isLayerVisible = layerId => filters.indexOf(layerId) !== -1;
  return (
    source.showFilter && source.layers.map(layer => (
      <button
        className={classnames({
          [styles.filterItem]: true,
          [styles['filterItem--visible']]: isLayerVisible(layer.id),
        })}
        key={`${layer.id}_filter`}
        onClick={toggleFilter(filters, layer.id)}
      >
        {layer.legendStyle &&
          <span style={layer.legendStyle || {}} className={styles.filterStyle} />
            }
        <span className={styles.filterLabel}>
          {layer.icon &&
            <img src={layer.icon} alt={layer.iconAlt} className={styles.filterIcon} />
              }
          {layer.name}
        </span>
        <Switch
          onChange={toggleFilter(filters, layer.id)}
          defaultChecked={layer.layout.visibility !== 'visible'}
          checked={isLayerVisible(layer.id)}
          size="small"
        />
      </button>
    ))
  );
};

const mapStateToProps = state => ({
  filters: state.appConfig.mapFilters,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleFilter: (filters, layerId) => () => {
    let mapFilters = [
      ...filters,
      layerId,
    ];
    if (filters.indexOf(layerId) !== -1) {
      mapFilters = mapFilters.filter(filter => filter !== layerId);
    }
    dispatch(ownProps.setFilter(layerId));
    dispatch(updateConfigValue('mapFilters', mapFilters));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TerraDrawMapFilters);
