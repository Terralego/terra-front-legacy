import React from 'react';
import { Checkbox } from 'antd';
import styles from './TerraDrawMapFilters.module.scss';

const TerraDrawMapFilters = ({ source, setFilter }) => (
  <div className={styles.filters}>
    {source.showFilter && source.layers.map(layer => (
      <Checkbox
        key={`${layer.id}_filter`}
        onChange={setFilter(layer.id)}
        defaultChecked
      >
        {layer.name}
      </Checkbox>
    ))}
  </div>
);

export default TerraDrawMapFilters;
