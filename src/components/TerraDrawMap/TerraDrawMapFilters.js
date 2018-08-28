import React from 'react';
import { Switch } from 'antd';
import styles from './TerraDrawMapFilters.module.scss';

const TerraDrawMapFilters = ({ source, setFilter }) => (
  source.showFilter && source.layers.map(layer => (
    <div className={styles.filter}>
      <Switch
        key={`${layer.id}_filter`}
        onChange={setFilter(layer.id)}
        defaultChecked={layer.layout.visibility === 'visible'}
        size="small"
      />
      <span className={styles.filterLabel}>{layer.name}</span>
    </div>
  ))
);

export default TerraDrawMapFilters;
