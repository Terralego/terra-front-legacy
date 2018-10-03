import React from 'react';
import classnames from 'classnames';
import { Switch } from 'antd';

import styles from 'components/TerraDrawMap/TerraDrawMapFilter.module.scss';

const TerraDrawMapFilter = ({
  icon,
  iconAlt,
  name,
  legendStyle,
  checked,
  toggleFilter,
}) => (
  <button
    type="button"
    className={classnames({
      [styles.filterItem]: true,
      [styles['filterItem--visible']]: checked,
    })}
    onClick={toggleFilter}
  >
    <span className={styles.filterLabel}>
      {icon && <img src={icon} alt={iconAlt} className={styles.filterIcon} />}
      {<span style={legendStyle || {}} className={styles.filterStyle} />}
      {name}
    </span>

    <Switch
      checked={checked}
      size="small"
    />
  </button>
);

export default TerraDrawMapFilter;
