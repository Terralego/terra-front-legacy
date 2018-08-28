import React from 'react';
import { Switch } from 'antd';
import styles from './TerraDrawMapFilters.module.scss';

const TerraDrawMapFilters = ({ source, setFilter }) => (
  source.showFilter && source.layers.map(layer => (
    <div className={styles.filter} key={`${layer.id}_filter`}>
      <Switch
        onChange={setFilter(layer.id)}
        defaultChecked={layer.layout.visibility === 'visible'}
        size="small"
      />
      {layer.legendStyle &&
        <span style={layer.legendStyle || {}} className={styles.filterStyle} />
      }
      <span className={styles.filterLabel}>
        {layer.icon &&
          <img src={layer.icon} alt={layer.iconAlt} className={styles.filterIcon} />
        }
        {layer.name}
      </span>
    </div>
  ))
);

export default TerraDrawMapFilters;
